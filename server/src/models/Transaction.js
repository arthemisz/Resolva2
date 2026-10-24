import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    productCode: {
        type: String,
        required: true,
        uppercase: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['sale', 'delivery', 'return'],
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    previousStock: {
        type: Number,
        required: true,
    },
    newStock: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed'],
        default: 'confirmed',
    }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);