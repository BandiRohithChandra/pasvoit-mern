import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    category: { type: String, enum: ["Men", "Women", "Kids"], required: true },
    sizes: [{ type: String, enum: ["S", "M", "L", "XL"] }],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
