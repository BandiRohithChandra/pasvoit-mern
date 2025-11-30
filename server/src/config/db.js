import mongoose from 'mongoose';

export async function connectDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}
