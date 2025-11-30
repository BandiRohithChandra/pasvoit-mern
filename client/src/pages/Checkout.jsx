import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import api from "../api/axios";
import "../styles/checkout.css";

export default function Checkout() {
    const navigate = useNavigate();
    const { items, fetchCart } = useCartStore();
    const [cartDetails, setCartDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user/guest cart
    useEffect(() => {
        const load = async () => {
            await fetchCart(); // ensures `items` is ready

            // Convert cart items into unified structure for backend
            const unifiedItems = (items || []).map((i) => ({
                productId: i.productId || i.product?._id,
                size: i.size,
                quantity: i.quantity
            }));

            if (unifiedItems.length === 0) {
                setCartDetails([]);
                setLoading(false);
                return;
            }

            // Fetch product details for each item
            api.post("/products/cart-details", { items: unifiedItems })
                .then((res) => {
                    setCartDetails(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log("Cart details error:", err);
                    setLoading(false);
                });
        };

        load();
    }, [items]);

    // Place order
    const handleCheckout = async () => {
    try {
        await api.post("/orders/checkout");   // ✔ FIXED
        alert("Order placed successfully!");
        navigate("/orders");
    } catch (err) {
        console.log(err);
        alert("You must login to place an order.");
    }
};


    // Loading
    if (loading) {
        return <h2 style={{ padding: 20 }}>Loading checkout...</h2>;
    }

    // Empty cart
    if (!cartDetails.length) {
        return <h2 style={{ padding: 20 }}>Your cart is empty.</h2>;
    }

    // Total amount
    const total = cartDetails.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Checkout</h2>

            <div className="checkout-list">
                {cartDetails.map((item) => (
                    <div key={item.productId + item.size} className="checkout-item">
                        <img src={item.imageUrl} className="checkout-img" alt={item.name} />

                        <div>
                            <h4>{item.name}</h4>
                            <p>Size: {item.size}</p>
                            <p>Qty: {item.qty}</p>
                            <b>₹{item.price}</b>
                        </div>
                    </div>
                ))}
            </div>

            <div className="checkout-summary">
                <h3>Total Amount: ₹{total}</h3>
                <button className="checkout-btn" onClick={handleCheckout}>
                    Place Order
                </button>
            </div>
        </div>
    );
}
