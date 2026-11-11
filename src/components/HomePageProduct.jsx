"use client";

import { useEffect, useState } from "react";
import { fetchAllProducts } from "@/lib/action/products";
import { buildProductHref } from "@/lib/productQuery";
import ProductSliderSection from "./ProductSliderSection";

const THEME = {
    wrap: "w-full",
    empty: "w-full px-4 sm:px-6 lg:px-8 py-10 text-center text-sm text-slate-500",
    skeletonTitle: "h-6 w-40 rounded bg-slate-200",
    skeletonCard: "flex-shrink-0 w-[170px] sm:w-[220px] lg:w-[250px] h-[320px] sm:h-[380px] rounded-2xl bg-slate-100 animate-pulse",
};

const TEXT = {
    empty: "Featured products will appear here once they are published.",
};

const SECTIONS = [
    { category: "Mens", title: "Mens Fashion" },
    { category: "Womens", title: "Womens Fashion" },
    { category: "Kids", title: "Kids Fashion" },
];

export default function HomePageProduct() {
    const [grouped, setGrouped] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const results = await Promise.all(
                    SECTIONS.map((section) =>
                        fetchAllProducts({
                            isFeatured: true,
                            category: section.category,
                            limit: 16,
                            sort: "newest",
                        })
                    )
                );
                if (!active) return;
                setGrouped(
                    Object.fromEntries(
                        SECTIONS.map((section, index) => [section.category, results[index]?.data || []])
                    )
                );
            } catch {
                if (active) setGrouped({});
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <div className={THEME.wrap}>
                {SECTIONS.map((section) => (
                    <section key={section.category} className="w-full bg-white py-8">
                        <div className="w-full px-4 sm:px-6 lg:px-8">
                            <div className={`${THEME.skeletonTitle} mb-6 animate-pulse`} />
                            <div className="flex gap-4 sm:gap-6 overflow-hidden">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className={THEME.skeletonCard} />
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        );
    }

    const sections = SECTIONS.map((section) => ({
        ...section,
        products: grouped[section.category] || [],
    })).filter((section) => section.products.length > 0);

    if (sections.length === 0) {
        return <p className={THEME.empty}>{TEXT.empty}</p>;
    }

    return (
        <main className={THEME.wrap}>
            {sections.map((section) => (
                <ProductSliderSection
                    key={section.category}
                    title={section.title}
                    products={section.products}
                    viewAllHref={buildProductHref({ category: section.category })}
                />
            ))}
        </main>
    );
}
