"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchAllProducts } from "@/lib/action/products";
import { buildProductHref, getProductListHeading, readProductFilters } from "@/lib/productQuery";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

const THEME = {
    layoutBg: "bg-slate-50 min-h-[60vh] py-5 sm:py-6",
    headingText: "text-slate-900 font-extrabold tracking-tight text-xl sm:text-2xl",
    countText: "text-sm text-slate-500",
    emptyTitle: "text-slate-800 font-semibold text-lg",
    emptySubtitle: "text-sm text-slate-500",
    pageBtn: "h-8 min-w-8 rounded-lg border px-2.5 text-xs font-semibold",
    pageIdle: "border-slate-200 bg-white text-slate-600 hover:border-teal-600 hover:text-teal-700",
    pageActive: "border-teal-600 bg-teal-50 text-teal-800",
};

const CARD_THEME = {
    cardBg: "bg-white border border-slate-200/60 rounded-2xl overflow-hidden group h-full",
    discountBadge: "bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded",
    soldOutBadge: "bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded",
    productTitle: "text-slate-800 text-xs sm:text-sm font-medium line-clamp-2 hover:text-teal-600 transition-colors",
    currentPrice: "text-rose-600 font-bold text-xs sm:text-sm",
    oldPrice: "text-slate-400 text-xs line-through",
};

const TEXT = {
    resultCount: (count) => `${count} ${count === 1 ? "product" : "products"} found`,
    emptyTitle: "No products found",
    emptySubtitle: "Try a different search or browse another category.",
    loadingText: "Loading products...",
    prev: "Prev",
    next: "Next",
};

const LIMIT = 24;

export default function ProductCatalog() {
    const searchParams = useSearchParams();
    const filters = readProductFilters(Object.fromEntries(searchParams.entries()));
    const page = Math.max(1, Number.parseInt(filters.page, 10) || 1);

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchAllProducts({
                    search: filters.search || undefined,
                    category: filters.category || undefined,
                    subCategory: filters.subCategory || undefined,
                    brand: filters.brand || undefined,
                    showInDiscount: filters.showInDiscount || undefined,
                    page,
                    limit: LIMIT,
                    sort: "newest",
                });
                if (!active) return;
                setProducts(res?.data || []);
                setTotal(res?.meta?.total || 0);
                setTotalPages(res?.meta?.totalPages || 0);
            } catch {
                if (!active) return;
                setProducts([]);
                setTotal(0);
                setTotalPages(0);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [
        filters.search,
        filters.category,
        filters.subCategory,
        filters.brand,
        filters.showInDiscount,
        page,
    ]);

    const heading = getProductListHeading(filters);

    return (
        <main className={THEME.layoutBg}>
            <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className={THEME.headingText}>{heading}</h1>
                    <p className={THEME.countText}>{loading ? TEXT.loadingText : TEXT.resultCount(total)}</p>
                </div>

                <ProductFilters filters={filters} />

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="h-[320px] rounded-2xl bg-white border border-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex min-h-[36vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
                        <p className={THEME.emptyTitle}>{TEXT.emptyTitle}</p>
                        <p className={`mt-1 ${THEME.emptySubtitle}`}>{TEXT.emptySubtitle}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id || product.slug}
                                    product={product}
                                    THEME={CARD_THEME}
                                    className="w-full h-full"
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 pt-2">
                                {page > 1 && (
                                    <Link
                                        href={buildProductHref({ ...filters, page: String(page - 1) })}
                                        className={`${THEME.pageBtn} ${THEME.pageIdle}`}
                                    >
                                        {TEXT.prev}
                                    </Link>
                                )}
                                {Array.from({ length: totalPages }, (_, index) => index + 1)
                                    .filter((item) => item === 1 || item === totalPages || Math.abs(item - page) <= 2)
                                    .map((item) => (
                                        <Link
                                            key={item}
                                            href={buildProductHref({ ...filters, page: item === 1 ? "" : String(item) })}
                                            className={`${THEME.pageBtn} ${item === page ? THEME.pageActive : THEME.pageIdle}`}
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                {page < totalPages && (
                                    <Link
                                        href={buildProductHref({ ...filters, page: String(page + 1) })}
                                        className={`${THEME.pageBtn} ${THEME.pageIdle}`}
                                    >
                                        {TEXT.next}
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
