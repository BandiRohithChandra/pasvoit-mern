import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

export default function App() {
    const loadUser = useAuthStore(state => state.loadUser);

    // FIX: Load user on app start
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <div className="app-wrapper">
            <BrowserRouter>
                <Navbar />

                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}
