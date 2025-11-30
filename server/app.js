import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';

// Route Files
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import orderRoutes from './src/routes/order.routes.js';

// Error Middlewares
import { notFound, errorHandler } from './src/middleware/error.js';

dotenv.config();
const app = express();

// Middlewares
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL, 
            "http://localhost:5173",
            "https://*.onrender.com"
        ],
        credentials: true,
    })
);


// Parse JSON bodies
app.use(express.json());

// Parse form data (fixes req.body undefined issues)
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req, res) => {
    res.json({ ok: true });
});

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling
app.use(notFound);       // 404
app.use(errorHandler);   // 500

// Start Server
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () =>
        console.log(`Server running at http://localhost:${PORT}`)
    );
});
