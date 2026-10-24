import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    productCode: {
        type: String,
        required: true,
        uppercase: true,
    },
    productName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['sale', 'delivery', 'return'],
    },
    quantity: {
        type: Number,
        required: true,
    },
    currentStock: {
        type: Number,
        required: true,
    },
    proposedBalance: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    }
}, { timestamps: true });

export const Proposal = mongoose.model('Proposal', proposalSchema);