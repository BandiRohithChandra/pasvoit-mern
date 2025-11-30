import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/navbar.css";

export default function Navbar() {
    const { user, logout } = useAuthStore();

    return (
        <nav className="navbar">
            <div className="container navbar-inner">

                <div className="logo">
                    <Link to="/">Pasovit Clothing</Link>
                </div>

                <div className="nav-links">

                    {/* Always visible */}
                    <Link to="/">Home</Link>     {/* ✔ Replaced Products */}
                    <Link to="/cart">Cart</Link>
                    <Link to="/orders">Orders</Link>

                    {/* If user logged in */}
                    {user ? (
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
}
