import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: true,

    // Load user from server using token
    loadUser: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            set({ user: null, loading: false });
            return;
        }

        try {
            const res = await api.get("/auth/me"); // <-- new route
            set({ user: res.data.user, loading: false });
        } catch (err) {
            console.log("Token invalid, clearing...");
            localStorage.removeItem("token");
            set({ user: null, token: null, loading: false });
        }
    },

    login: async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        set({ user: res.data.user, token: res.data.token });
    },

    register: async (name, email, password) => {
        await api.post("/auth/register", { name, email, password });
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    }
}));
