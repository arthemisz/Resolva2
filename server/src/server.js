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

// 6. Quick setup endpoint - creates demo user with pre-hashed password
app.post('/api/quick-setup', async (req, res) => {
    try {
        console.log('🚀 Quick setup starting...');
        
        // Check if demo user already exists
        const existing = await User.findOne({ email: 'demo@resolva.com' });
        if (existing) {
            console.log('Demo user already exists');
            // Just seed products
            const seedProducts = [
                { name: "SoftCare Soap", code: "SOAP-001", unit: "box", quantity: 12 },
                { name: "SoftCare Soap Plus", code: "SOAP-002", unit: "box", quantity: 8 },
                { name: "Golden Flour", code: "FLOUR-001", unit: "bag", quantity: 25 },
                { name: "SunFresh Cooking Oil", code: "OIL-001", unit: "bottle", quantity: 18 },
                { name: "PureDrop Water", code: "WATER-001", unit: "carton", quantity: 30 }
            ];

            let seededCount = 0;
            for (const item of seedProducts) {
                const existingProduct = await Product.findOne({ code: item.code, userId: existing._id });
                if (!existingProduct) {
                    await Product.create({ ...item, userId: existing._id });
                    seededCount++;
                }
            }

            return res.json({
                success: true,
                message: 'Setup complete! Demo user already existed.',
                demoUser: { email: 'demo@resolva.com', password: 'demo123' },
                productsSeeded: seededCount
            });
        }
        
        // Import bcrypt with default import
        const bcrypt = (await import('bcryptjs')).default;
        
        // Create user with pre-hashed password
        const hashedPassword = await bcrypt.hash('demo123', 10);
        console.log('Password hashed successfully');
        
        // Insert directly into collection to bypass pre-save hook
        const result = await User.collection.insertOne({
            name: 'Demo User',
            email: 'demo@resolva.com',
            password: hashedPassword,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const demoUserId = result.insertedId;
        console.log('✅ Demo user created:', demoUserId);

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
            await Product.create({ ...item, userId: demoUserId });
            seededCount++;
        }

        console.log('✅ Setup complete!');
        res.json({
            success: true,
            message: 'Setup complete! You can now login.',
            demoUser: {
                email: 'demo@resolva.com',
                password: 'demo123'
            },
            productsSeeded: seededCount
        });
    } catch (error) {
        console.error('❌ Setup error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            errorName: error.name
        });
    }
});

// 7. Seed Database Endpoint (PUBLIC - for initial setup only)
app.post('/api/seed', async (req, res) => {
    try {
        console.log('🌱 Starting seed process...');
        
        // Check if demo user exists
        console.log('Checking for existing demo user...');
        let demoUser = await User.findOne({ email: 'demo@resolva.com' });
        
        if (!demoUser) {
            console.log('Demo user not found. Please register via /api/auth/register first.');
            return res.status(400).json({
                success: false,
                message: 'Please create a demo user first by registering at /api/auth/register with email: demo@resolva.com and password: demo123',
                instructions: {
                    method: 'POST',
                    url: '/api/auth/register',
                    body: {
                        name: 'Demo User',
                        email: 'demo@resolva.com',
                        password: 'demo123'
                    }
                }
            });
        }
        
        console.log('Demo user found:', demoUser.email);
        
        // Check existing products
        const existingProducts = await Product.countDocuments({ userId: demoUser._id });
        console.log('Existing products for demo user:', existingProducts);
        
        if (existingProducts >= 5) {
            return res.json({
                success: true,
                message: 'Database already seeded!',
                demoUser: { email: 'demo@resolva.com', password: 'demo123' },
                productsExisting: existingProducts
            });
        }

        // Seed products
        console.log('Seeding products...');
        const seedProducts = [
            { name: "SoftCare Soap", code: "SOAP-001", unit: "box", quantity: 12 },
            { name: "SoftCare Soap Plus", code: "SOAP-002", unit: "box", quantity: 8 },
            { name: "Golden Flour", code: "FLOUR-001", unit: "bag", quantity: 25 },
            { name: "SunFresh Cooking Oil", code: "OIL-001", unit: "bottle", quantity: 18 },
            { name: "PureDrop Water", code: "WATER-001", unit: "carton", quantity: 30 }
        ];

        let seededCount = 0;
        for (const item of seedProducts) {
            console.log(`Checking product: ${item.code}`);
            const existing = await Product.findOne({ code: item.code, userId: demoUser._id });
            if (!existing) {
                await Product.create({ ...item, userId: demoUser._id });
                seededCount++;
                console.log(`✅ Created: ${item.code}`);
            } else {
                console.log(`⏭️  Already exists: ${item.code}`);
            }
        }

        console.log('✅ Seed completed!');
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
        console.error('❌ Seed error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            errorName: error.name,
            errorCode: error.code
        });
    }
});

// 7. Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        mongodb: 'connected'
    });
});

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Inventory Backend live at http://localhost:${PORT}`);
    });
};

start();