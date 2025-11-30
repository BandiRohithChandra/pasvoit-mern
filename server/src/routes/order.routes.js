import { Router } from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { sendOrderEmail } from "../utils/email.js";

const router = Router();

/* -----------------------------------------------------
    PLACE ORDER (Checkout)
----------------------------------------------------- */
router.post("/checkout", protect, async (req, res, next) => {
    try {
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Convert cart items to order items
        const items = cart.items.map((i) => ({
            product: i.product._id,
            name: i.product.name,
            price: i.product.price,
            size: i.size,
            quantity: i.quantity
        }));

        // Calculate total
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create Order
        const order = await Order.create({
            user: req.user.id,
            items,
            total
        });

        // Clear cart after placing order
        cart.items = [];
        await cart.save();

        // Fetch user for email
        const user = await User.findById(req.user.id);

        // Send confirmation email
        await sendOrderEmail(user.email, order);

        res.json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("CHECKOUT ERROR:", error);
        next(error);
    }
});

/* -----------------------------------------------------
    GET USER ORDERS
----------------------------------------------------- */
router.get("/", protect, async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.product") // ensures product image is available
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        next(error);
    }
});

export default router;
