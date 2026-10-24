import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Product } from './models/Product.js';
import { Transaction } from './models/Transaction.js';
import { User } from './models/User.js';
import { processAgentChat } from './services/agent.js';
import { createProduct, findProducts, recordTransaction } from './services/tools.js';
import authRoutes from './routes/authRoutes.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const pluralizeUnit = (quantity, unit) => {
    if (quantity === 1 || unit.endsWith('s')) return unit;
    if (/(x|ch|sh|z)$/.test(unit)) return `${unit}es`;
    if (/[^aeiou]y$/.test(unit)) return `${unit.slice(0, -1)}ies`;
    return `${unit}s`;
};

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRoutes);

// 1. Get all products (now protected)
app.get('/api/products', authenticate, async (req, res) => {
    try {
        // Only get products for the authenticated user
        const products = await Product.find({ userId: req.userId }).sort({ code: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', authenticate, async (req, res) => {
    try {
        const { name, quantity, unit } = req.body;
        // Pass userId to createProduct
        const result = await createProduct({ name, quantity, unit, userId: req.userId });
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: error.message || 'Could not create product.' });
    }
});

// 2. Chat with AI Agent
app.post('/api/chat', authenticate, async (req, res) => {
    try {
        const { message, history } = req.body;
        if (typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const addMatch = message.match(
            /^\s*(?:please\s+)?add\s+(\d+)\s+(?:(\S+)\s+of\s+)?(.+?)(?:\s+(?:to|into)\s+(?:the\s+)?(?:stock|inventory))?[.!?]*\s*$/i
        );
        if (addMatch) {
            const [, quantityText, requestedUnit, requestedName] = addMatch;
            const name = requestedName.trim();
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Filter by userId
            const existingProduct = await Product.findOne({
                userId: req.userId,
                name: { $regex: escapedName, $options: 'i' }
            });

            const quantity = Number(quantityText);
            if (!existingProduct && Number.isSafeInteger(quantity) && quantity > 0 && name) {
                const productProposal = {
                    name,
                    quantity,
                    unit: requestedUnit || 'unit'
                };
                return res.json({
                    reply: `"${name}" isn't in the inventory. Review the item below and choose Confirm to create it or Cancel to dismiss.`,
                    productProposal
                });
            }
        }

        // Pass userId to agent
        const response = await processAgentChat(message, history || [], req.userId);
        res.json(response);
    } catch (error) {
        console.error('Agent chat error:', error);
        res.status(500).json({ error: error.message || 'AI agent processing error.' });
    }
});

// 3. Confirm Transaction (Direct endpoint for UI Confirm button)
app.post('/api/transactions/confirm', authenticate, async (req, res) => {
    try {
        const { productCode, transactionType, quantity } = req.body;
        // Pass userId to recordTransaction
        const result = await recordTransaction({
            productCode,
            transactionType,
            quantity,
            confirmed: true,
            userId: req.userId
        });

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Reopen Saved Transaction by ID
app.get('/api/transactions/:id', authenticate, async (req, res) => {
    try {
        // Only get transaction for authenticated user
        const tx = await Transaction.findOne({ _id: req.params.id, userId: req.userId });
        if (!tx) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }
        res.json(tx);
    } catch (error) {
        res.status(400).json({ error: 'Invalid ID format.' });
    }
});

// 5. List Recent Transactions
app.get('/api/transactions', authenticate, async (req, res) => {
    try {
        // Only get transactions for authenticated user
        const list = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20);
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Seed Database Endpoint (PUBLIC - for initial setup only)
app.post('/api/seed', async (req, res) => {
    try {
        // Check if already seeded
        const existingUser = await User.findOne({ email: 'demo@resolva.com' });
        if (existingUser) {
            const productCount = await Product.countDocuments({ userId: existingUser._id });
            if (productCount >= 5) {
                return res.json({
                    success: true,
                    message: 'Database already seeded!',
                    demoUser: { email: 'demo@resolva.com', password: 'demo123' },
                    productsExisting: productCount
                });
            }
        }
        
        // Create demo user
        let demoUser = existingUser;
        if (!demoUser) {
            demoUser = await User.create({
                name: 'Demo User',
                email: 'demo@resolva.com',
                password: 'demo123',
                role: 'user'
            });
        }

        // Seed products
        const seedProducts = [
            { name: "SoftCare Soap", code: "SOAP-001", unit: "box", quantity: 12 },
            { name: "SoftCare Soap Plus", code: "SOAP-002", unit: "box", quantity: 8 },
            { name: "Golden Flour", code: "FLOUR-001", unit: "bag", quantity: 25 },
            { name: "SunFresh Cooking Oil", code: "OIL-001", unit: "bottle", quantity: 18 },
            { name: "PureDrop Water", code: "WATER-001", unit: "carton", quantity: 30 }
        ];

        let seededCount = 0;
        for (const item of seedProducts) {
            const existing = await Product.findOne({ code: item.code, userId: demoUser._id });
            if (!existing) {
                await Product.create({ ...item, userId: demoUser._id });
                seededCount++;
            }
        }

        res.json({
            success: true,
            message: `Database seeded successfully!`,
            demoUser: {
                email: 'demo@resolva.com',
                password: 'demo123'
            },
            productsSeeded: seededCount,
            totalProducts: seedProducts.length
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
        });
    }
});

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Inventory Backend live at http://localhost:${PORT}`);
    });
};

start();