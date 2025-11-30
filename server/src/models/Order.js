import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    
    // Store product info at the time of order
    name: { type: String, required: true },
    price: { type: Number, required: true },

    size: { type: String, required: true },  // removed enum to avoid size errors
    quantity: { type: Number, min: 1, default: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: { type: [orderItemSchema], required: true },

    total: { type: Number, required: true },

    placedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
