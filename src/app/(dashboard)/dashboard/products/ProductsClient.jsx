"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { deleteProduct, fetchAllProducts } from "@/lib/action/products";
import { formatSubCategory } from "@/data/categories";
import { formatPrice } from "@/lib/pricing";

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
    actions: "flex items-center justify-end gap-1",
    actionBtn: "p-2 rounded-lg text-[#5C6560] hover:bg-[#F4F1EC] hover:text-teal-700 transition-colors disabled:opacity-40",
    dangerBtn: "p-2 rounded-lg text-[#5C6560] hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-40",
};

const TEXT = {
    title: "Catalog",
    add: "Add product",
    emptyTitle: "The catalog is empty",
    emptySubtitle: "Add the first product to start selling.",
    loadError: "Could not load products.",
    count: (total) => `${total} ${total === 1 ? "product" : "products"}`,
    actions: "Actions",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    deleteTitle: "Delete this product?",
    deleteText: (title) => `"${title}" will be removed from the catalog. This cannot be undone.`,
    confirmDelete: "Delete",
    cancel: "Cancel",
    deletedTitle: "Product deleted",
    deleteError: "Could not delete product.",
};

const getApiMessage = (error) =>
    error?.response?.data?.message || error?.message || TEXT.deleteError;

export default function DashboardProductsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [deletingId, setDeletingId] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchAllProducts({ status: "all", limit: 48, sort: "newest" });
                setProducts(res?.data || []);
                setTotal(res?.meta?.total || res?.data?.length || 0);
            } catch {
                setError(TEXT.loadError);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleDelete = async (product) => {
        const confirmed = await Swal.fire({
            icon: "warning",
            title: TEXT.deleteTitle,
            text: TEXT.deleteText(product.title),
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#6B7873",
            confirmButtonText: TEXT.confirmDelete,
            cancelButtonText: TEXT.cancel,
        });

        if (!confirmed.isConfirmed) return;

        setDeletingId(product._id);
        try {
            await deleteProduct(product._id);
            setProducts((prev) => prev.filter((item) => item._id !== product._id));
            setTotal((prev) => Math.max(0, prev - 1));
            await Swal.fire({
                icon: "success",
                title: TEXT.deletedTitle,
                confirmButtonColor: "#0d9488",
                timer: 1400,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: TEXT.deleteError,
                text: getApiMessage(err),
                confirmButtonColor: "#0d9488",
            });
        } finally {
            setDeletingId("");
        }
    };

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
                    <table className="w-full min-w-[860px]">
                        <thead>
                            <tr>
                                <th className={THEME.tableHead}>Product</th>
                                <th className={THEME.tableHead}>Category</th>
                                <th className={THEME.tableHead}>Price</th>
                                <th className={THEME.tableHead}>Stock</th>
                                <th className={THEME.tableHead}>Status</th>
                                <th className={`${THEME.tableHead} text-right`}>{TEXT.actions}</th>
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
                                        {formatPrice(product.discountPrice ?? product.price ?? 0)}
                                    </td>
                                    <td className={THEME.tableCell}>{product.stock ?? 0}</td>
                                    <td className={THEME.tableCell}>
                                        <span className={product.status === "draft" ? THEME.badgeDraft : THEME.badgeActive}>
                                            {product.status || "active"}
                                        </span>
                                    </td>
                                    <td className={THEME.tableCell}>
                                        <div className={THEME.actions}>
                                            <Link
                                                href={`/product/${product.slug}`}
                                                className={THEME.actionBtn}
                                                title={TEXT.view}
                                                aria-label={TEXT.view}
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/dashboard/products/${product._id}/edit`}
                                                className={THEME.actionBtn}
                                                title={TEXT.edit}
                                                aria-label={TEXT.edit}
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                type="button"
                                                className={THEME.dangerBtn}
                                                title={TEXT.delete}
                                                aria-label={TEXT.delete}
                                                disabled={deletingId === product._id}
                                                onClick={() => handleDelete(product)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
