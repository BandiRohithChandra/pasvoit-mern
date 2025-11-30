import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Fetch or create user cart
async function getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    return cart;
}

// Merge guest cart when user logs in
router.post('/merge', protect, async (req, res, next) => {
    try {
        const { items = [] } = req.body;
        const cart = await getOrCreateCart(req.user.id);

        items.forEach(guest => {
            const existing = cart.items.find(
                c => String(c.product) === guest.product && c.size === guest.size
            );
            if (existing) existing.quantity += guest.quantity;
            else cart.items.push(guest);
        });

        await cart.save();
        res.json(cart);

    } catch (error) {
        next(error);
    }
});

// Get user cart
router.get('/', protect, async (req, res, next) => {
    try {
        const cart = await getOrCreateCart(req.user.id);
        await cart.populate('items.product');
        res.json(cart);
    } catch (error) {
        next(error);
    }
});

// Add item to cart
router.post('/', protect, async (req, res, next) => {
    try {
        const { product, size, quantity = 1 } = req.body;

        const prod = await Product.findById(product);
        if (!prod) return res.status(404).json({ message: 'Product not found' });

        if (!prod.sizes.includes(size))
            return res.status(400).json({ message: "Invalid size" });

        const cart = await getOrCreateCart(req.user.id);

        const item = cart.items.find(i => String(i.product) === product && i.size === size);
        if (item) item.quantity += Number(quantity);
        else cart.items.push({ product, size, quantity });

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);

    } catch (error) {
        next(error);
    }
});

// Update quantity
router.patch('/', protect, async (req, res, next) => {
    try {
        const { product, size, quantity } = req.body;

        const cart = await getOrCreateCart(req.user.id);

        const item = cart.items.find(i => String(i.product) === product && i.size === size);
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        if (quantity <= 0) {
            cart.items = cart.items.filter(i => !(String(i.product) === product && i.size === size));
        } else {
            item.quantity = Number(quantity);
        }

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);

    } catch (error) {
        next(error);
    }
});

// Remove item
router.delete('/', protect, async (req, res, next) => {
    try {
        const { product, size } = req.body;

        const cart = await getOrCreateCart(req.user.id);
        cart.items = cart.items.filter(i => !(String(i.product) === product && i.size === size));

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);

    } catch (error) {
        next(error);
    }
});

export default router;
