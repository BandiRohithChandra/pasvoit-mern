import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get("/orders")
            .then(res => setOrders(res.data))
            .catch(err => console.log("Orders Error:", err));
    }, []);

    if (orders.length === 0) {
        return (
            <div className="orders-empty">
                <Link to="/" className="back-btn">← Back to Products</Link>
                <h2>No Orders Yet</h2>
                <p>Your orders will appear here after purchasing items.</p>
            </div>
        );
    }

    return (
        <div className="orders-page">

            {/* Back to Home Button */}
            <Link to="/" className="back-btn">← Back to Products</Link>

            <h2 className="orders-title">Your Orders</h2>

            {orders.map(order => (
                <div key={order._id} className="order-card">
                    
                    <div className="order-header">
                        <div>
                            <p className="order-label">ORDER PLACED</p>
                            <p>{new Date(order.placedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="order-label">TOTAL</p>
                            <p>₹{order.total}</p>
                        </div>
                        <div>
                            <p className="order-label">ORDER ID</p>
                            <p>{order._id}</p>
                        </div>
                    </div>

                    {order.items.map(item => (
                        <div key={item._id + item.size} className="order-item">
                            <img
                                src={item.product?.imageUrl || ""}
                                alt={item.name}
                                className="order-item-img"
                            />

                            <div className="order-item-info">
                                <p className="order-item-name">{item.name}</p>
                                <p className="order-item-sub">Size: {item.size}</p>
                                <p className="order-item-sub">Qty: {item.quantity}</p>
                                <p className="order-item-price">₹{item.price}</p>

                                <button className="buy-again-btn">Buy Again</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
