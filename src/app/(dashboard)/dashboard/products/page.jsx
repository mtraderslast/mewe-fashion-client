"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllProducts } from "@/lib/action/products";
import { formatSubCategory } from "@/data/categories";

const THEME = {
    card: "rounded-2xl border border-[#E4DED4] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(18,32,29,0.04)]",
    toolbar: "mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    title: "text-lg font-semibold text-[#1B2A26]",
    muted: "text-sm text-[#6B7873]",
    cta: "inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5",
    tableHead: "text-left text-[11px] uppercase tracking-wider text-[#6B7873] pb-3",
    tableCell: "py-3.5 text-sm text-[#1B2A26] border-t border-[#EFEAE2] align-middle",
    thumb: "h-12 w-12 rounded-lg object-cover bg-[#F4F1EC] border border-[#E4DED4]",
    badgeActive: "inline-flex rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold",
    badgeDraft: "inline-flex rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[11px] font-semibold",
};

const TEXT = {
    title: "Catalog",
    add: "Add product",
    emptyTitle: "The catalog is empty",
    emptySubtitle: "Add the first product to start selling.",
    loadError: "Could not load products.",
    count: (total) => `${total} ${total === 1 ? "product" : "products"}`,
};

export default function DashboardProductsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAllProducts({ status: "all", limit: 48, sort: "newest" });
                setProducts(res?.data || []);
                setTotal(res?.meta?.total || res?.data?.length || 0);
            } catch (err) {
                setError(TEXT.loadError);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <section className={THEME.card}>
            <div className={THEME.toolbar}>
                <div>
                    <h2 className={THEME.title}>{TEXT.title}</h2>
                    <p className={THEME.muted}>{loading ? "Loading..." : TEXT.count(total)}</p>
                </div>
                <Link href="/dashboard/products/add" className={THEME.cta}>{TEXT.add}</Link>
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-base font-semibold text-[#1B2A26]">{TEXT.emptyTitle}</p>
                    <p className={`mt-1 ${THEME.muted}`}>{TEXT.emptySubtitle}</p>
                </div>
            )}

            {products.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                        <thead>
                            <tr>
                                <th className={THEME.tableHead}>Product</th>
                                <th className={THEME.tableHead}>Category</th>
                                <th className={THEME.tableHead}>Price</th>
                                <th className={THEME.tableHead}>Stock</th>
                                <th className={THEME.tableHead}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id || product.slug}>
                                    <td className={THEME.tableCell}>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.images?.[0] || "/placeholder.jpg"}
                                                alt={product.title}
                                                className={THEME.thumb}
                                            />
                                            <div>
                                                <p className="font-medium">{product.title}</p>
                                                <p className={THEME.muted}>{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={THEME.tableCell}>
                                        {product.category} · {formatSubCategory(product.subCategory)}
                                    </td>
                                    <td className={THEME.tableCell}>
                                        ৳{Number(product.discountPrice ?? product.price ?? 0).toLocaleString()}
                                    </td>
                                    <td className={THEME.tableCell}>{product.stock ?? 0}</td>
                                    <td className={THEME.tableCell}>
                                        <span className={product.status === "draft" ? THEME.badgeDraft : THEME.badgeActive}>
                                            {product.status || "active"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
