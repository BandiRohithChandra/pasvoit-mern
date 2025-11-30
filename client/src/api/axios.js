import axios from "axios";



console.log("🔥 axios.js LOADED → BASE URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

// Inject token if logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
