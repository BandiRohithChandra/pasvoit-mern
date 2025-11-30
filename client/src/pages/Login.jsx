import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            navigate("/");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <div className="login-footer">
                    Don’t have an account? <Link to="/register">Register</Link>
                </div>

            </div>
        </div>
    );
}
