import { Router } from 'express';
import User from '../models/User.js';
import { signToken, protect } from '../middleware/auth.js';

const router = Router();

// ----------------------- REGISTER -----------------------
router.post('/register', async (req, res, next) => {
    try {
        console.log("INCOMING BODY:", req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already registered" });

        const user = await User.create({ name, email, password });

        console.log("CREATED USER:", user);

        // Do NOT auto-login — registration only
        return res.status(201).json({
            message: "Registration successful",
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        next(error);
    }
});

// ----------------------- LOAD LOGGED-IN USER -----------------------
router.get("/me", protect, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
});

// ----------------------- LOGIN -----------------------
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        const valid = await user.comparePassword(password);
        if (!valid)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = signToken(user._id);

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        next(error);
    }
});

export default router;
