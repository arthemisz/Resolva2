import { Product } from '../models/Product.js';
import { Transaction } from '../models/Transaction.js';
import { randomBytes } from 'node:crypto';

export async function createProduct({ name, quantity, unit = 'unit', userId }) {
    const productName = typeof name === 'string' ? name.trim() : '';
    const productUnit = typeof unit === 'string' ? unit.trim() : '';
    const qty = Number(quantity);

    if (!userId) {
        return { error: 'User ID is required.' };
    }
    if (!productName) {
        return { error: 'Product name is required.' };
    }
    if (!['number', 'string'].includes(typeof quantity) || !Number.isSafeInteger(qty) || qty <= 0) {
        return { error: 'Quantity must be a positive whole number.' };
    }
    if (!productUnit) {
        return { error: 'Product unit is required.' };
    }

    const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingProduct = await Product.findOne({
        userId,
        name: { $regex: `^${escapedName}$`, $options: 'i' }
    });
    if (existingProduct) {
        return { error: `A product named "${existingProduct.name}" already exists.` };
    }

    const prefix = productName
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 12) || 'ITEM';
    const code = `${prefix}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const product = await Product.create({
        userId,
        name: productName,
        code,
        unit: productUnit,
        quantity: qty
    });

    return {
        success: true,
        product: {
            name: product.name,
            code: product.code,
            unit: product.unit,
            quantity: product.quantity
        }
    };
}

// Tool 1: find_products
export async function findProducts({ searchPhrase, userId }) {
    if (!searchPhrase || typeof searchPhrase !== 'string') {
        return { error: 'Invalid search phrase provided.' };
    }
    if (!userId) {
        return { error: 'User ID is required.' };
    }

    const matches = await Product.find({
        userId,
        $or: [
            { name: { $regex: searchPhrase.trim(), $options: 'i' } },
            { code: { $regex: searchPhrase.trim(), $options: 'i' } }
        ]
    }).select('name code unit quantity -_id');

    if (matches.length === 0) {
        return { message: `No products found matching "${searchPhrase}".` };
    }

    return {
        count: matches.length,
        products: matches.map(p => ({
            name: p.name,
            code: p.code,
            unit: p.unit
        }))
    };
}

// Tool 2: check_stock
export async function checkStock({ productCode, userId }) {
    if (!productCode) return { error: 'Product code is required.' };
    if (!userId) return { error: 'User ID is required.' };

    const product = await Product.findOne({ 
        userId,
        code: productCode.toUpperCase() 
    });
    if (!product) {
        return { error: `Product with code ${productCode} not found in database.` };
    }

    return {
        name: product.name,
        code: product.code,
        currentQuantity: product.quantity,
        unit: product.unit
    };
}

// Tool 3: record_transaction
export async function recordTransaction({ productCode, transactionType, quantity, confirmed, userId }) {
    if (!confirmed) {
        return { error: 'Cannot record transaction without explicit user confirmation.' };
    }
    if (!userId) {
        return { error: 'User ID is required.' };
    }

    const code = productCode.toUpperCase();
    const qty = Number(quantity);
    const type = transactionType.toLowerCase();

    if (isNaN(qty) || qty <= 0) {
        return { error: 'Quantity must be a positive number.' };
    }

    if (!['sale', 'delivery', 'return'].includes(type)) {
        return { error: 'Transaction type must be sale, delivery, or return.' };
    }

    const product = await Product.findOne({ userId, code });
    if (!product) {
        return { error: `Product with code ${code} does not exist.` };
    }

    const previousStock = product.quantity;
    let stockDelta = 0;

    if (type === 'sale') {
        if (previousStock < qty) {
            return {
                error: `Insufficient stock: Requested sale of ${qty} ${product.unit}, but only ${previousStock} ${product.unit} available.`
            };
        }
        stockDelta = -qty;
    } else if (type === 'delivery' || type === 'return') {
        stockDelta = qty;
    }

    // Atomic update to avoid race conditions and guard against negative stock
    const updateQuery = { userId, code };
    if (type === 'sale') {
        updateQuery.quantity = { $gte: qty };
    }

    const updatedProduct = await Product.findOneAndUpdate(
        updateQuery,
        { $inc: { quantity: stockDelta } },
        { returnDocument: 'after' }
    );

    if (!updatedProduct) {
        return { error: 'Concurrency error: Stock level changed before update could complete.' };
    }

    const transaction = await Transaction.create({
        userId,
        productCode: code,
        type,
        quantity: qty,
        previousStock,
        newStock: updatedProduct.quantity,
        status: 'confirmed'
    });

    return {
        success: true,
        transactionId: transaction._id,
        productName: product.name,
        productCode: code,
        type,
        quantity: qty,
        previousStock,
        newStock: transaction.newStock,
        unit: product.unit,
        createdAt: transaction.createdAt
    };
}