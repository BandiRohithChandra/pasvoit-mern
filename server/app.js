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

app.use(cors({
    origin: function (origin, callback) {
        // Allow local dev
        if (!origin || origin.startsWith("http://localhost")) {
            return callback(null, true);
        }

        // Allow ALL Vercel URLs
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        // Allow your Render frontend (if any)
        if (origin.includes("pasvoit")) {
            return callback(null, true);
        }

        return callback(new Error("CORS Not Allowed: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


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
