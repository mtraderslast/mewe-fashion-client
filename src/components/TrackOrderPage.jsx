"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Search } from "lucide-react";
import { trackOrder } from "@/lib/action/orders";
import { formatPrice } from "@/lib/pricing";
import { FULFILLMENT_LABELS, PAYMENT_LABELS, formatAttributes, statusBadgeClass } from "@/lib/orderStatus";

const THEME = {
    page: "bg-slate-50 min-h-[70vh] py-6 sm:py-8",
    card: "rounded-2xl border border-slate-200 bg-white p-4 sm:p-6",
    heading: "text-slate-900 font-extrabold tracking-tight text-xl sm:text-2xl",
    input: "h-10 w-full rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:bg-white",
    button: "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-r-lg bg-teal-600 px-4 text-sm font-semibold text-white hover:bg-teal-700",
    muted: "text-sm text-slate-500",
    badge: "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
};

const TEXT = {
    title: "Track your order",
    subtitle: "Enter the tracking ID from your order confirmation.",
    placeholder: "MEWE-XXXXXXXX",
    search: "Track",
    searching: "Looking up...",
    empty: "No tracking details yet. Enter your ID to see status.",
    notFound: "No order found for this tracking ID.",
    items: "Items",
    timeline: "Shipment timeline",
    carrier: "Carrier",
    eta: "Estimated delivery",
    payment: "Payment",
    total: "Order total",
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

export default function TrackOrderPage() {
    const searchParams = useSearchParams();
    const queryId = (searchParams.get("id") || "").trim();
    const [draft, setDraft] = useState(queryId);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(Boolean(queryId));

    const lookup = async (trackingId) => {
        const id = trackingId.trim().toUpperCase();
        if (!id) return;

        setLoading(true);
        setError("");
        try {
            const res = await trackOrder(id);
            setOrder(res?.data || null);
        } catch {
            setOrder(null);
            setError(TEXT.notFound);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (queryId) lookup(queryId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        lookup(draft);
    };

    return (
        <main className={THEME.page}>
            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 space-y-5">
                <div>
                    <h1 className={THEME.heading}>{TEXT.title}</h1>
                    <p className={`mt-1 ${THEME.muted}`}>{TEXT.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className={`${THEME.card} p-3 sm:p-4`}>
                    <div className="flex">
                        <input
                            type="search"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value.toUpperCase())}
                            placeholder={TEXT.placeholder}
                            aria-label={TEXT.placeholder}
                            className={THEME.input}
                        />
                        <button type="submit" className={THEME.button} disabled={loading}>
                            <Search size={15} />
                            {loading ? TEXT.searching : TEXT.search}
                        </button>
                    </div>
                </form>

                {error && (
                    <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
                )}

                {!order && !error && !loading && (
                    <div className={`${THEME.card} py-12 text-center`}>
                        <PackageSearch className="mx-auto mb-3 h-10 w-10 text-teal-600" />
                        <p className={THEME.muted}>{TEXT.empty}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-4">
                        <section className={THEME.card}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tracking ID</p>
                                    <p className="mt-1 text-lg font-bold text-slate-900">{order.trackingId}</p>
                                    <p className={`mt-1 ${THEME.muted}`}>Order {order.orderNumber}</p>
                                </div>
                                <span className={`${THEME.badge} ${statusBadgeClass(order.fulfillmentStatus)}`}>
                                    {FULFILLMENT_LABELS[order.fulfillmentStatus] || order.fulfillmentStatus}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{TEXT.payment}</p>
                                    <p className="mt-1 font-medium text-slate-800">
                                        {order.paymentMethod === "cod"
                                            ? "Cash on delivery"
                                            : PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                                    </p>
                                    {order.paymentMethod === "cod" && (
                                        <p className="text-xs text-slate-400">
                                            {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{TEXT.carrier}</p>
                                    <p className="mt-1 font-medium text-slate-800">
                                        {order.tracking?.carrier || "Assigning carrier"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{TEXT.eta}</p>
                                    <p className="mt-1 font-medium text-slate-800">
                                        {order.tracking?.estimatedDelivery
                                            ? formatDate(order.tracking.estimatedDelivery)
                                            : "Updating soon"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={THEME.card}>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">{TEXT.timeline}</h2>
                            <ol className="mt-4 space-y-4">
                                {(order.tracking?.events || []).slice().reverse().map((event, index) => (
                                    <li key={`${event.at}-${index}`} className="flex gap-3">
                                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {FULFILLMENT_LABELS[event.status] || event.status}
                                            </p>
                                            <p className={THEME.muted}>{event.message}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">{formatDate(event.at)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section className={THEME.card}>
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">{TEXT.items}</h2>
                                <p className="text-sm font-semibold text-slate-900">
                                    {TEXT.total}: {formatPrice(order.pricing?.total)}
                                </p>
                            </div>
                            <div className="space-y-3">
                                {(order.items || []).map((item, index) => (
                                    <div key={`${item.title}-${index}`} className="flex gap-3">
                                        <div className="h-14 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                            <img src={item.image || "/placeholder.jpg"} alt="" className="h-full w-full object-contain" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
                                            <p className="text-xs text-slate-500">
                                                Qty {item.quantity}
                                                {formatAttributes(item.selectedAttributes)
                                                    ? ` · ${formatAttributes(item.selectedAttributes)}`
                                                    : ""}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">{formatPrice(item.lineTotal)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
