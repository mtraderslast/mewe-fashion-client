export const FULFILLMENT_STATUS = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
];

export const PAYMENT_STATUS = [
    "unpaid",
    "pending",
    "authorized",
    "paid",
    "failed",
    "refunded",
    "partially_refunded",
];

export const FULFILLMENT_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned",
};

export const PAYMENT_LABELS = {
    unpaid: "Unpaid",
    pending: "Pending",
    authorized: "Authorized",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
    partially_refunded: "Partial refund",
};

export const statusBadgeClass = (status) => {
    if (["delivered", "paid"].includes(status)) return "bg-emerald-50 text-emerald-700";
    if (["cancelled", "failed", "returned"].includes(status)) return "bg-rose-50 text-rose-700";
    if (["shipped", "out_for_delivery", "processing", "confirmed"].includes(status)) {
        return "bg-sky-50 text-sky-700";
    }
    if (["refunded", "partially_refunded"].includes(status)) return "bg-amber-50 text-amber-800";
    return "bg-slate-100 text-slate-600";
};

export const formatAttributes = (attributes = {}) => {
    const source = attributes instanceof Map ? Object.fromEntries(attributes) : attributes;
    return Object.entries(source)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => `${key}: ${value}`)
        .join(" · ");
};
