import { Router } from 'express';
import Product from '../models/Product.js';
import { buildQuery } from '../utils/paginate.js';

const router = Router();

// GET → list products (search + filters + pagination)
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 12 } = req.query;

        const filter = buildQuery(req.query);
        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
            Product.find(filter)
                .skip(skip)
                .limit(Number(limit))
                .sort({ createdAt: -1 }),
            Product.countDocuments(filter)
        ]);

        res.json({
            items,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });

    } catch (error) {
        next(error);
    }
});

// GET → product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        next(error);
    }
});

// POST → cart details (Used in Checkout)
router.post('/cart-details', async (req, res, next) => {
    try {
        const { items = [] } = req.body;

        const detailed = await Promise.all(
            items.map(async (i) => {
                const product = await Product.findById(i.productId);

                return {
                    productId: i.productId,
                    name: product?.name || "",
                    imageUrl: product?.imageUrl || "",
                    price: product?.price || 0,
                    size: i.size,
                    qty: i.quantity
                };
            })
        );

        res.json(detailed);

    } catch (error) {
        next(error);
    }
});

export default router;
