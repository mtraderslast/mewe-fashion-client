"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "mewe-cart";

const listeners = new Set();

let state = {
    items: [],
    isOpen: false,
};

let didHydrate = false;

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const emit = () => {
    listeners.forEach((listener) => listener());
};

const loadItems = () => {
    if (typeof window === "undefined") return [];

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const persistItems = (items) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const setState = (partial) => {
    state = { ...state, ...partial };
    if (partial.items) persistItems(partial.items);
    emit();
};

const hydrate = () => {
    if (didHydrate || typeof window === "undefined") return;
    didHydrate = true;
    setState({ items: loadItems() });
};

const makeCartItemId = (slug, selectedAttributes = {}) => {
    const variantKey = Object.entries(selectedAttributes)
        .filter(([, value]) => Boolean(value))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join("|");

    return variantKey ? `${slug}__${variantKey}` : slug;
};

const getTotalItems = () =>
    state.items.reduce((total, item) => total + item.quantity, 0);

const openCart = () => setState({ isOpen: true });

const closeCart = () => setState({ isOpen: false });

const addToCart = ({ slug, quantity = 1, selectedAttributes = {} }) => {
    if (!slug || quantity < 1) return;

    const cartItemId = makeCartItemId(slug, selectedAttributes);
    const existing = state.items.find((item) => item.cartItemId === cartItemId);

    const items = existing
        ? state.items.map((item) =>
            item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
        )
        : [...state.items, { cartItemId, slug, quantity, selectedAttributes }];

    setState({ items, isOpen: true });
};

const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) {
        removeFromCart(cartItemId);
        return;
    }

    setState({
        items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
        ),
    });
};

const removeFromCart = (cartItemId) => {
    setState({
        items: state.items.filter((item) => item.cartItemId !== cartItemId),
    });
};

const getStore = () => ({
    items: state.items,
    isOpen: state.isOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
});

const SERVER_SNAPSHOT = {
    items: [],
    isOpen: false,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getTotalItems: () => 0,
};

export function useCartStore(selector = (store) => store) {
    useEffect(() => {
        hydrate();
    }, []);

    return useSyncExternalStore(
        subscribe,
        () => selector(getStore()),
        () => selector(SERVER_SNAPSHOT)
    );
}
