"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProductById } from "@/lib/action/products";
import AddProductForm from "./AddProductForm";

const THEME = {
    card: "rounded-2xl border border-[#E4DED4] bg-white p-8 text-center shadow-[0_8px_30px_rgba(18,32,29,0.04)]",
    title: "text-lg font-semibold text-[#1B2A26]",
    muted: "text-sm text-[#6B7873]",
    cta: "inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 mt-5",
};

const TEXT = {
    loading: "Loading product...",
    missingTitle: "Product not found",
    missingSubtitle: "This listing may have been removed.",
    back: "Back to catalog",
};

export default function EditProductForm() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const res = await fetchProductById(id);
                setProduct(res?.data || null);
                if (!res?.data) setError(true);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    if (loading) {
        return (
            <section className={THEME.card}>
                <p className={THEME.muted}>{TEXT.loading}</p>
            </section>
        );
    }

    if (error || !product) {
        return (
            <section className={THEME.card}>
                <p className={THEME.title}>{TEXT.missingTitle}</p>
                <p className={`mt-1 ${THEME.muted}`}>{TEXT.missingSubtitle}</p>
                <Link href="/dashboard/products" className={THEME.cta}>
                    {TEXT.back}
                </Link>
            </section>
        );
    }

    return <AddProductForm key={product._id} product={product} />;
}
