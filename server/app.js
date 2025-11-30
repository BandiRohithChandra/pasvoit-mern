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
        const allowed = [
            process.env.CLIENT_URL,                     // your main frontend
            "https://pasvoit-mern-1.onrender.com",     // backend
        ];

        // Allow all Vercel preview deployments:
        const vercelPattern = /^https:\/\/pasvoit-mern-.*\.vercel\.app$/;

        if (!origin) return callback(null, true); // allow Postman, server calls

        if (allowed.includes(origin) || vercelPattern.test(origin)) {
            return callback(null, true);
        }

        console.log("❌ BLOCKED ORIGIN:", origin);
        return callback(new Error("CORS Not allowed"));
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
