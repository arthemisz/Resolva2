import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { Product } from '../src/models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
    try {
        await connectDB();

        const seedDataPath = path.join(__dirname, '../data/products.seed.json');
        const products = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

        // Upsert each product by its unique code: updates if exists, creates if new
        for (const item of products) {
            await Product.findOneAndUpdate(
                { code: item.code },
                { $setOnInsert: item }, // Keeps whatever live quantities exist in Atlas; only sets values if it is a brand new product
                { upsert: true, new: true }
            );
        }

        console.log('Processed seed items without deleting database changes!');
        process.exit(0);
    } catch (error) {
        console.error(`Seeding failed: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();