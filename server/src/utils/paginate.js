export function buildQuery({ q, category, size, minPrice, maxPrice }) {
    const filter = {};

    // Search by name or description
    if (q) {
        filter.$or = [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ];
    }

    // Category filter
    if (category) {
        filter.category = category;
    }

    // Size filter
    if (size) {
        filter.sizes = size;  // product must contain this size
    }

    // Price range
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    return filter;
}
