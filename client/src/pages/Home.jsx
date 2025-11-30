import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../styles/products.css";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [size, setSize] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const fetchProducts = () => {
        api.get("/products", {
            params: {
                page,
                limit: 10,
                search,
                category,
                size,
                price: priceRange
            }
        })
        .then(res => {
            setProducts(res.data.items);
            setTotalPages(res.data.totalPages);
        })
        .catch(err => {
            console.error("Error loading products:", err);
        });
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, category, size, priceRange]);

    return (
        <div className="products-page">
            <h2 className="heading">All Products</h2>

            {/* ----------- FILTER BAR ----------- */}
            <div className="filter-bar">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                />

                {/* Category */}
                <select
                    value={category}
                    onChange={(e)=> setCategory(e.target.value)}
                    className="filter-input"
                >
                    <option value="">All Categories</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                </select>

                {/* Size */}
                <select
                    value={size}
                    onChange={(e)=> setSize(e.target.value)}
                    className="filter-input"
                >
                    <option value="">All Sizes</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>

                {/* Price Range */}
                <select
                    value={priceRange}
                    onChange={(e)=> setPriceRange(e.target.value)}
                    className="filter-input"
                >
                    <option value="">Price Range</option>
                    <option value="0-500">0 - 500</option>
                    <option value="500-1000">500 - 1000</option>
                    <option value="1000-2000">1000 - 2000</option>
                    <option value="2000-5000">2000 - 5000</option>
                </select>
            </div>

            {/* ----------- PRODUCTS GRID ----------- */}
            <div className="products-grid">
                {products.map(p => (
                    <Link key={p._id} to={`/product/${p._id}`} className="product-card">
                        <img src={p.imageUrl} alt={p.name} />
                        <h4>{p.name}</h4>
                        <p>₹{p.price}</p>
                    </Link>
                ))}
            </div>

            {/* ----------- PAGINATION ----------- */}
            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
