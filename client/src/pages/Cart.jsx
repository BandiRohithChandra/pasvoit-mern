import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

export default function Cart() {
    const { items, fetchCart, updateItem, removeItem } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>

            {items.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                <>
                    {items.map(i => (
                        <div className="cart-item" key={i.product._id + i.size}>
                            <h4>{i.product.name} ({i.size})</h4>
                            <p>₹{i.product.price}</p>

                            <input
                                type="number"
                                className="cart-qty"
                                value={i.quantity}
                                min="1"
                                onChange={(e) =>
                                    updateItem(i.product._id, i.size, Number(e.target.value))
                                }
                            />

                            <button
                                className="remove-btn"
                                onClick={() => removeItem(i.product._id, i.size)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <div className="total-box">
                        Total: ₹{total}
                    </div>

                    <button
                        className="checkout-btn"
                        onClick={() => navigate("/checkout")}
                    >
                        Go To Checkout
                    </button>
                </>
            )}
        </div>
    );
}
