import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import { demoProducts } from './products.seed.js';

dotenv.config();

async function seedProducts() {
    try {
        await connectDB(process.env.MONGO_URI);

        console.log("Clearing old products...");
        await Product.deleteMany();

        console.log("Inserting demo products...");
        await Product.insertMany(demoProducts);

        console.log("Seed completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exit(1);
    }
}

seedProducts();
