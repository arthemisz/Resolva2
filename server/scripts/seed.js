import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
    try {
        await connectDB();

        // Create or find default demo user
        let demoUser = await User.findOne({ email: 'demo@resolva.com' });
        
        if (!demoUser) {
            console.log('Creating demo user...');
            demoUser = await User.create({
                name: 'Demo User',
                email: 'demo@resolva.com',
                password: 'demo123', // Will be hashed automatically
                role: 'user'
            });
            console.log('✅ Demo user created: demo@resolva.com / demo123');
        } else {
            console.log('✅ Demo user already exists');
        }

        const seedDataPath = path.join(__dirname, '../data/products.seed.json');
        const products = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

        // Upsert each product with userId
        for (const item of products) {
            await Product.findOneAndUpdate(
                { code: item.code, userId: demoUser._id },
                { 
                    $setOnInsert: { 
                        ...item,
                        userId: demoUser._id 
                    } 
                },
                { upsert: true, returnDocument: 'after' }
            );
        }

        console.log(`✅ Seeded ${products.length} products for demo user`);
        console.log('\n📝 Login credentials:');
        console.log('   Email: demo@resolva.com');
        console.log('   Password: demo123');
        
        process.exit(0);
    } catch (error) {
        console.error(`❌ Seeding failed: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();