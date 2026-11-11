"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Sparkles, Tag, Layers } from "lucide-react";
import { fetchAllProducts, fetchCategorySummary } from "@/lib/action/products";
import { formatSubCategory } from "@/data/categories";

const THEME = {
    grid: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4",
    card: "rounded-2xl border border-[#E4DED4] bg-white p-5 shadow-[0_8px_30px_rgba(18,32,29,0.04)]",
    statLabel: "text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7873]",
    statValue: "mt-3 text-3xl font-semibold text-[#1B2A26]",
    iconWrap: "h-10 w-10 rounded-xl bg-[#12201D] text-[#9FE0D7] flex items-center justify-center",
    sectionTitle: "text-lg font-semibold text-[#1B2A26]",
    muted: "text-sm text-[#6B7873]",
    tableHead: "text-left text-[11px] uppercase tracking-wider text-[#6B7873] pb-3",
    tableCell: "py-3 text-sm text-[#1B2A26] border-t border-[#EFEAE2]",
    badgeActive: "inline-flex rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold",
    badgeDraft: "inline-flex rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[11px] font-semibold",
    cta: "inline-flex items-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5",
};

const TEXT = {
    total: "Total products",
    active: "Active listings",
    discount: "On discount",
    categories: "Categories",
    recentTitle: "Latest listings",
    emptyTitle: "No products yet",
    emptySubtitle: "Create the first listing to start the MEWE catalog.",
    addProduct: "Add product",
    loadError: "Could not load dashboard data.",
    unnamed: "Untitled",
};

const STAT_ICONS = {
    total: Package,
    active: Sparkles,
    discount: Tag,
    categories: Layers,
};

export default function DashboardHomePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState({ total: 0, active: 0, discount: 0 });
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [productRes, activeRes, discountRes, summaryRes] = await Promise.all([
                    fetchAllProducts({ status: "all", limit: 8, sort: "newest" }),
                    fetchAllProducts({ status: "active", limit: 1 }),
                    fetchAllProducts({ showInDiscount: true, limit: 1 }),
                    fetchCategorySummary(),
                ]);

                setProducts(productRes?.data || []);
                setMeta({
                    total: productRes?.meta?.total || 0,
                    active: activeRes?.meta?.total || 0,
                    discount: discountRes?.meta?.total || 0,
                });
                setSummary(summaryRes?.data || []);
            } catch (err) {
                setError(TEXT.loadError);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const categoryCount = summary.filter((item) => item.total > 0).length || summary.length;

    const stats = [
        { key: "total", label: TEXT.total, value: meta.total || 0 },
        { key: "active", label: TEXT.active, value: meta.active || 0 },
        { key: "discount", label: TEXT.discount, value: meta.discount || 0 },
        { key: "categories", label: TEXT.categories, value: categoryCount },
    ];

    return (
        <div className="space-y-8">
            <div className={THEME.grid}>
                {stats.map((stat) => {
                    const Icon = STAT_ICONS[stat.key];
                    return (
                        <article key={stat.key} className={THEME.card}>
                            <div className="flex items-start justify-between">
                                <p className={THEME.statLabel}>{stat.label}</p>
                                <div className={THEME.iconWrap}>
                                    <Icon size={18} />
                                </div>
                            </div>
                            <p className={THEME.statValue}>{loading ? "—" : stat.value}</p>
                        </article>
                    );
                })}
            </div>

            <section className={THEME.card}>
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className={THEME.sectionTitle}>{TEXT.recentTitle}</h2>
                    <Link href="/dashboard/products/add" className={THEME.cta}>{TEXT.addProduct}</Link>
                </div>

                {error && <p className="text-sm text-rose-500">{error}</p>}

                {!loading && !error && products.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-base font-semibold text-[#1B2A26]">{TEXT.emptyTitle}</p>
                        <p className={`mt-1 ${THEME.muted}`}>{TEXT.emptySubtitle}</p>
                    </div>
                )}

                {products.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px]">
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
                                            <p className="font-medium">{product.title || TEXT.unnamed}</p>
                                            <p className={THEME.muted}>{product.slug}</p>
                                        </td>
                                        <td className={THEME.tableCell}>
                                            {product.category} · {formatSubCategory(product.subCategory)}
                                        </td>
                                        <td className={THEME.tableCell}>৳{Number(product.discountPrice ?? product.price ?? 0).toLocaleString()}</td>
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
        </div>
    );
}
