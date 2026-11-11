"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchOrderById, updateOrder } from "@/lib/action/orders";
import { formatPrice } from "@/lib/pricing";
import {
    FULFILLMENT_LABELS,
    FULFILLMENT_STATUS,
    PAYMENT_LABELS,
    PAYMENT_STATUS,
    formatAttributes,
    statusBadgeClass,
} from "@/lib/orderStatus";

const THEME = {
    card: "rounded-2xl border border-[#E4DED4] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(18,32,29,0.04)]",
    title: "text-lg font-semibold text-[#1B2A26]",
    muted: "text-sm text-[#6B7873]",
    label: "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#6B7873]",
    input: "h-9 w-full rounded-lg border border-[#E4DED4] bg-[#F4F1EC] px-3 text-sm text-[#1B2A26] outline-none focus:border-teal-600",
    textarea: "min-h-[72px] w-full rounded-lg border border-[#E4DED4] bg-[#F4F1EC] px-3 py-2 text-sm outline-none focus:border-teal-600",
    cta: "inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-60",
    badge: "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
};

const TEXT = {
    back: "Back to orders",
    save: "Save changes",
    saving: "Saving...",
    loadError: "Could not load order.",
    saved: "Order updated",
    saveError: "Could not update order.",
};

const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export default function DashboardOrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        fulfillmentStatus: "pending",
        paymentStatus: "unpaid",
        carrier: "",
        carrierTrackingNumber: "",
        estimatedDelivery: "",
        notes: "",
        eventMessage: "",
        eventLocation: "",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchOrderById(id);
                const data = res?.data;
                setOrder(data);
                setForm({
                    fulfillmentStatus: data?.fulfillmentStatus || "pending",
                    paymentStatus: data?.payment?.status || "unpaid",
                    carrier: data?.tracking?.carrier || "",
                    carrierTrackingNumber: data?.tracking?.carrierTrackingNumber || "",
                    estimatedDelivery: data?.tracking?.estimatedDelivery
                        ? new Date(data.tracking.estimatedDelivery).toISOString().slice(0, 10)
                        : "",
                    notes: data?.notes || "",
                    eventMessage: "",
                    eventLocation: "",
                });
            } catch {
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = {
                fulfillmentStatus: form.fulfillmentStatus,
                paymentStatus: form.paymentStatus,
                notes: form.notes,
                tracking: {
                    carrier: form.carrier,
                    carrierTrackingNumber: form.carrierTrackingNumber,
                    estimatedDelivery: form.estimatedDelivery || undefined,
                },
            };
            if (form.eventMessage.trim()) {
                payload.event = {
                    status: form.fulfillmentStatus,
                    message: form.eventMessage.trim(),
                    location: form.eventLocation.trim(),
                };
            }

            const res = await updateOrder(id, payload);
            setOrder(res?.data);
            setForm((prev) => ({ ...prev, eventMessage: "", eventLocation: "" }));
            Swal.fire({ icon: "success", title: TEXT.saved, timer: 1200, showConfirmButton: false });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: TEXT.saveError,
                text: err?.response?.data?.message || TEXT.saveError,
                confirmButtonColor: "#0d9488",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className={THEME.muted}>Loading order...</p>;
    }

    if (!order) {
        return (
            <section className={THEME.card}>
                <p className="text-sm text-rose-600">{TEXT.loadError}</p>
                <button type="button" onClick={() => router.push("/dashboard/orders")} className="mt-3 text-sm text-teal-700">
                    {TEXT.back}
                </button>
            </section>
        );
    }

    return (
        <div className="space-y-5">
            <Link href="/dashboard/orders" className="text-sm font-medium text-[#6B7873] hover:text-teal-700">
                ← {TEXT.back}
            </Link>

            <section className={THEME.card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className={THEME.title}>{order.orderNumber}</h2>
                        <p className={THEME.muted}>{order.trackingId}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`${THEME.badge} ${statusBadgeClass(order.payment?.status)}`}>
                            {PAYMENT_LABELS[order.payment?.status] || order.payment?.status}
                        </span>
                        <span className={`${THEME.badge} ${statusBadgeClass(order.fulfillmentStatus)}`}>
                            {FULFILLMENT_LABELS[order.fulfillmentStatus] || order.fulfillmentStatus}
                        </span>
                    </div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    <div>
                        <p className={THEME.label}>Customer</p>
                        <p className="text-sm font-medium">{order.customer?.name}</p>
                        <p className={THEME.muted}>{order.customer?.email}</p>
                        <p className={THEME.muted}>{order.customer?.phone}</p>
                    </div>
                    <div>
                        <p className={THEME.label}>Ship to</p>
                        <p className="text-sm">
                            {order.shippingAddress?.street}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                            {order.shippingAddress?.country}
                        </p>
                    </div>
                </div>
            </section>

            <section className={THEME.card}>
                <h3 className="mb-4 text-sm font-semibold text-[#1B2A26]">Items</h3>
                <div className="space-y-3">
                    {(order.items || []).map((item, index) => (
                        <div key={`${item.slug}-${index}`} className="flex gap-3">
                            <img src={item.image || "/placeholder.jpg"} alt="" className="h-14 w-12 rounded-lg object-contain bg-[#F4F1EC] border border-[#E4DED4]" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className={THEME.muted}>
                                    Qty {item.quantity}
                                    {formatAttributes(item.selectedAttributes) ? ` · ${formatAttributes(item.selectedAttributes)}` : ""}
                                </p>
                            </div>
                            <p className="text-sm font-semibold">{formatPrice(item.lineTotal)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between border-t border-[#EFEAE2] pt-3 text-sm">
                    <span className={THEME.muted}>Total</span>
                    <span className="font-bold">{formatPrice(order.pricing?.total)}</span>
                </div>
            </section>

            <form onSubmit={handleSave} className={`${THEME.card} space-y-4`}>
                <h3 className="text-sm font-semibold text-[#1B2A26]">Update order</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className={THEME.label}>Fulfillment</label>
                        <select
                            className={THEME.input}
                            value={form.fulfillmentStatus}
                            onChange={(event) => setForm((prev) => ({ ...prev, fulfillmentStatus: event.target.value }))}
                        >
                            {FULFILLMENT_STATUS.map((status) => (
                                <option key={status} value={status}>{FULFILLMENT_LABELS[status]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={THEME.label}>Payment</label>
                        <select
                            className={THEME.input}
                            value={form.paymentStatus}
                            onChange={(event) => setForm((prev) => ({ ...prev, paymentStatus: event.target.value }))}
                        >
                            {PAYMENT_STATUS.map((status) => (
                                <option key={status} value={status}>{PAYMENT_LABELS[status]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={THEME.label}>Carrier</label>
                        <input
                            className={THEME.input}
                            value={form.carrier}
                            onChange={(event) => setForm((prev) => ({ ...prev, carrier: event.target.value }))}
                            placeholder="UPS, USPS, FedEx"
                        />
                    </div>
                    <div>
                        <label className={THEME.label}>Carrier tracking no.</label>
                        <input
                            className={THEME.input}
                            value={form.carrierTrackingNumber}
                            onChange={(event) => setForm((prev) => ({ ...prev, carrierTrackingNumber: event.target.value }))}
                        />
                    </div>
                    <div>
                        <label className={THEME.label}>Estimated delivery</label>
                        <input
                            type="date"
                            className={THEME.input}
                            value={form.estimatedDelivery}
                            onChange={(event) => setForm((prev) => ({ ...prev, estimatedDelivery: event.target.value }))}
                        />
                    </div>
                    <div>
                        <label className={THEME.label}>Event location</label>
                        <input
                            className={THEME.input}
                            value={form.eventLocation}
                            onChange={(event) => setForm((prev) => ({ ...prev, eventLocation: event.target.value }))}
                            placeholder="Optional"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={THEME.label}>Tracking note</label>
                        <input
                            className={THEME.input}
                            value={form.eventMessage}
                            onChange={(event) => setForm((prev) => ({ ...prev, eventMessage: event.target.value }))}
                            placeholder="Shown on the customer tracking timeline"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={THEME.label}>Internal notes</label>
                        <textarea
                            className={THEME.textarea}
                            value={form.notes}
                            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                        />
                    </div>
                </div>
                <button type="submit" disabled={saving} className={THEME.cta}>
                    {saving ? TEXT.saving : TEXT.save}
                </button>
            </form>

            <section className={THEME.card}>
                <h3 className="mb-4 text-sm font-semibold text-[#1B2A26]">Timeline</h3>
                <ol className="space-y-3">
                    {(order.tracking?.events || []).slice().reverse().map((event, index) => (
                        <li key={`${event.at}-${index}`}>
                            <p className="text-sm font-medium">{FULFILLMENT_LABELS[event.status] || event.status}</p>
                            <p className={THEME.muted}>{event.message}</p>
                            <p className="text-xs text-[#8AA39B]">{formatDate(event.at)}</p>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
