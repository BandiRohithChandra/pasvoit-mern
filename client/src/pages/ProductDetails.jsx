import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCartStore } from "../store/cartStore";
import "../styles/productDetails.css";


export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [size, setSize] = useState("");
    const [loading, setLoading] = useState(true);

    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setSize(res.data.sizes[0]);   // default size
                setLoading(false);
            })
            .catch((err) => {
                console.log("Error fetching product:", err);
            });
    }, [id]);

    if (loading)
        return <p style={{ padding: 20, fontSize: "18px" }}>Loading product...</p>;

    return (
        <div className="product-details">
            
            {/* Product Image */}
            <div className="product-image-wrapper">
                <img src={product.imageUrl} alt={product.name} />
            </div>

            {/* Product Information */}
            <div className="product-info">
                <h2>{product.name}</h2>

                <p className="price">₹{product.price}</p>
                <p className="description">{product.description}</p>

                {/* Size Selector */}
                <div className="size-select">
                    <label>Select Size:</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                        {product.sizes.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add to Cart Button */}
                <button
                    className="add-to-cart-btn"
                    onClick={() => {
                        addToCart(product._id, size, 1);
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
