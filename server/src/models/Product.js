import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    unit: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
    }
}, { timestamps: true });

// Text index to support keyword search for find_products
productSchema.index({ name: 'text', code: 'text' });

export const Product = mongoose.model('Product', productSchema);