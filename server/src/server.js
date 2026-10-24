import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Product } from './models/Product.js';
import { Transaction } from './models/Transaction.js';
import { processAgentChat } from './services/agent.js';
import { recordTransaction } from './services/tools.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ code: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Chat with AI Agent
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required.' });
        }
        const response = await processAgentChat(message, history || []);
        res.json(response);
    } catch (error) {
        console.error('Agent chat error:', error);
        res.status(500).json({ error: error.message || 'AI agent processing error.' });
    }
});

// 3. Confirm Transaction (Direct endpoint for UI Confirm button)
app.post('/api/transactions/confirm', async (req, res) => {
    try {
        const { productCode, transactionType, quantity } = req.body;
        const result = await recordTransaction({
            productCode,
            transactionType,
            quantity,
            confirmed: true
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
app.get('/api/transactions/:id', async (req, res) => {
    try {
        const tx = await Transaction.findById(req.params.id);
        if (!tx) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }
        res.json(tx);
    } catch (error) {
        res.status(400).json({ error: 'Invalid ID format.' });
    }
});

// 5. List Recent Transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const list = await Transaction.find().sort({ createdAt: -1 }).limit(20);
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Inventory Backend live at http://localhost:${PORT}`);
    });
};

start();