"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { deleteOrder, fetchAllOrders } from "@/lib/action/orders";
import { formatPrice } from "@/lib/pricing";
import {
    FULFILLMENT_LABELS,
    FULFILLMENT_STATUS,
    PAYMENT_LABELS,
    statusBadgeClass,
} from "@/lib/orderStatus";

const THEME = {
    card: "rounded-2xl border border-[#E4DED4] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(18,32,29,0.04)]",
    title: "text-lg font-semibold text-[#1B2A26]",
    muted: "text-sm text-[#6B7873]",
    input: "h-9 rounded-lg border border-[#E4DED4] bg-[#F4F1EC] px-3 text-sm text-[#1B2A26] outline-none focus:border-teal-600",
    tableHead: "text-left text-[11px] uppercase tracking-wider text-[#6B7873] pb-3",
    tableCell: "py-3.5 text-sm text-[#1B2A26] border-t border-[#EFEAE2] align-middle",
    badge: "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
    actionBtn: "p-2 rounded-lg text-[#5C6560] hover:bg-[#F4F1EC] hover:text-teal-700 transition-colors",
    dangerBtn: "p-2 rounded-lg text-[#5C6560] hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-40",
};

const TEXT = {
    title: "Orders",
    searchPlaceholder: "Search tracking, email, name",
    all: "All",
    empty: "No orders yet.",
    loadError: "Could not load orders.",
    deleteTitle: "Delete this order?",
    deleteText: "This cannot be undone.",
    confirmDelete: "Delete",
    cancel: "Cancel",
    deleted: "Order deleted",
    deleteError: "Could not delete order.",
};

const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function DashboardOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [deletingId, setDeletingId] = useState("");

    const load = async (nextSearch = search, nextStatus = status) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchAllOrders({
                search: nextSearch || undefined,
                fulfillmentStatus: nextStatus || undefined,
                limit: 40,
                sort: "newest",
            });
            setOrders(res?.data || []);
            setTotal(res?.meta?.total || 0);
        } catch {
            setError(TEXT.loadError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        load(search, status);
    };

    const handleStatus = (value) => {
        setStatus(value);
        load(search, value);
    };

    const handleDelete = async (order) => {
        const confirmed = await Swal.fire({
            icon: "warning",
            title: TEXT.deleteTitle,
            text: TEXT.deleteText,
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#6B7873",
            confirmButtonText: TEXT.confirmDelete,
            cancelButtonText: TEXT.cancel,
        });
        if (!confirmed.isConfirmed) return;

        setDeletingId(order._id);
        try {
            await deleteOrder(order._id);
            setOrders((prev) => prev.filter((item) => item._id !== order._id));
            setTotal((prev) => Math.max(0, prev - 1));
            Swal.fire({ icon: "success", title: TEXT.deleted, timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: TEXT.deleteError,
                text: err?.response?.data?.message || TEXT.deleteError,
                confirmButtonColor: "#0d9488",
            });
        } finally {
            setDeletingId("");
        }
    };

    return (
        <section className={THEME.card}>
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className={THEME.title}>{TEXT.title}</h2>
                    <p className={THEME.muted}>{loading ? "Loading..." : `${total} orders`}</p>
                </div>
                <form onSubmit={handleSearch} className="flex w-full max-w-md">
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={TEXT.searchPlaceholder}
                        className={`${THEME.input} w-full rounded-r-none`}
                    />
                    <button type="submit" className="h-9 rounded-r-lg bg-teal-600 px-3 text-xs font-semibold text-white hover:bg-teal-700">
                        Search
                    </button>
                </form>
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
                <button
                    type="button"
                    onClick={() => handleStatus("")}
                    className={`h-8 rounded-lg px-3 text-xs font-semibold border ${!status ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-600"}`}
                >
                    {TEXT.all}
                </button>
                {FULFILLMENT_STATUS.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => handleStatus(item)}
                        className={`h-8 rounded-lg px-3 text-xs font-semibold border ${status === item ? "border-teal-600 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-600"}`}
                    >
                        {FULFILLMENT_LABELS[item]}
                    </button>
                ))}
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            {!loading && !error && orders.length === 0 && (
                <p className={`py-12 text-center ${THEME.muted}`}>{TEXT.empty}</p>
            )}

            {orders.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[920px]">
                        <thead>
                            <tr>
                                <th className={THEME.tableHead}>Order</th>
                                <th className={THEME.tableHead}>Customer</th>
                                <th className={THEME.tableHead}>Total</th>
                                <th className={THEME.tableHead}>Payment</th>
                                <th className={THEME.tableHead}>Fulfillment</th>
                                <th className={THEME.tableHead}>Date</th>
                                <th className={`${THEME.tableHead} text-right`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className={THEME.tableCell}>
                                        <p className="font-medium">{order.orderNumber}</p>
                                        <p className={THEME.muted}>{order.trackingId}</p>
                                    </td>
                                    <td className={THEME.tableCell}>
                                        <p>{order.customer?.name}</p>
                                        <p className={THEME.muted}>{order.customer?.email}</p>
                                    </td>
                                    <td className={THEME.tableCell}>{formatPrice(order.pricing?.total)}</td>
                                    <td className={THEME.tableCell}>
                                        <span className={`${THEME.badge} ${statusBadgeClass(order.payment?.status)}`}>
                                            {PAYMENT_LABELS[order.payment?.status] || order.payment?.status}
                                        </span>
                                    </td>
                                    <td className={THEME.tableCell}>
                                        <span className={`${THEME.badge} ${statusBadgeClass(order.fulfillmentStatus)}`}>
                                            {FULFILLMENT_LABELS[order.fulfillmentStatus] || order.fulfillmentStatus}
                                        </span>
                                    </td>
                                    <td className={THEME.tableCell}>{formatDate(order.createdAt)}</td>
                                    <td className={THEME.tableCell}>
                                        <div className="flex justify-end gap-1">
                                            <Link href={`/dashboard/orders/${order._id}`} className={THEME.actionBtn} title="View">
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                type="button"
                                                className={THEME.dangerBtn}
                                                disabled={deletingId === order._id}
                                                onClick={() => handleDelete(order)}
                                                title="Delete"
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
