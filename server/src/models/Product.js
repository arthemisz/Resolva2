import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
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

// Compound index for unique code per user
productSchema.index({ userId: 1, code: 1 }, { unique: true });

export const Product = mongoose.model('Product', productSchema);