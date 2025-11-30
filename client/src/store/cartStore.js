import { create } from "zustand";
import api from "../api/axios";

export const useCartStore = create((set, get) => ({
    items: JSON.parse(localStorage.getItem("guest_cart")) || [],
    isAuthenticated: !!localStorage.getItem("token"),

    // Load cart based on auth
    fetchCart: async () => {
        if (!get().isAuthenticated) {
            const local = JSON.parse(localStorage.getItem("guest_cart")) || [];
            set({ items: local });
            return;
        }

        const res = await api.get("/cart");
        set({ items: res.data.items });
    },

    // ADD ITEM
    addToCart: async (productId, size, quantity = 1) => {
        const { isAuthenticated } = get();

        if (!isAuthenticated) {
            // Guest cart
            let cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

            const existing = cart.find(
                (i) => i.productId === productId && i.size === size
            );

            if (existing) existing.quantity += quantity;
            else cart.push({ productId, size, quantity });

            localStorage.setItem("guest_cart", JSON.stringify(cart));
            set({ items: cart });
            alert("Added to cart!");
            return;
        }

        // Logged-in → backend cart
        await api.post("/cart", { product: productId, size, quantity });
        get().fetchCart();
        alert("Added to cart!");
    },

    // UPDATE QTY
    updateItem: async (productId, size, quantity) => {
        if (!get().isAuthenticated) {
            let cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

            cart = cart.map((item) =>
                item.productId === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            );

            localStorage.setItem("guest_cart", JSON.stringify(cart));
            set({ items: cart });
            return;
        }

        await api.patch("/cart", { product: productId, size, quantity });
        get().fetchCart();
    },

    // REMOVE
    removeItem: async (productId, size) => {
        if (!get().isAuthenticated) {
            let cart = JSON.parse(localStorage.getItem("guest_cart")) || [];

            cart = cart.filter(
                (i) => !(i.productId === productId && i.size === size)
            );

            localStorage.setItem("guest_cart", JSON.stringify(cart));
            set({ items: cart });
            return;
        }

        await api.delete("/cart", { data: { product: productId, size } });
        get().fetchCart();
    },

    // MERGE guest cart → user cart
    mergeCartAfterLogin: async () => {
        const guestItems = JSON.parse(localStorage.getItem("guest_cart")) || [];

        if (guestItems.length > 0) {
            await api.post("/cart/merge", { items: guestItems });
            localStorage.removeItem("guest_cart");
        }

        get().fetchCart();
    }
}));
