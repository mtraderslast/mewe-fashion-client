"use client";

import { useEffect, useState } from "react";
import { mensProducts, womensProducts, kidsProducts } from "@/data/product";
import { fetchProductDetails } from "@/lib/action/products";
import ProductDetails from "./ProductDetails";

const THEME = {
    state: "min-h-[60vh] flex items-center justify-center text-slate-600 font-semibold text-lg",
};

const TEXT = {
    loading: "Loading product...",
    missing: "Sorry, the product you are looking for does not exist.",
};

const MOCK_PRODUCTS = [...mensProducts, ...womensProducts, ...kidsProducts];

const normalizeProduct = (product) => ({
    ...product,
    images: product.images || [],
    variants: product.variants || [],
});

export default function ProductDetailsLoader({ slug }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const res = await fetchProductDetails(slug);
                if (active) setProduct(res?.data ? normalizeProduct(res.data) : null);
            } catch {
                const fallback = MOCK_PRODUCTS.find((item) => item.slug === slug) || null;
                if (active) setProduct(fallback ? normalizeProduct(fallback) : null);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [slug]);

    if (loading) {
        return <div className={THEME.state}>{TEXT.loading}</div>;
    }

    if (!product) {
        return <div className={THEME.state}>{TEXT.missing}</div>;
    }

    return <ProductDetails product={product} />;
}
