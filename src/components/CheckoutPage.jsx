"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    ArrowLeft,
    Banknote,
    Lock,
    Mail,
    MapPin,
    Phone,
    ShoppingBag,
    User,
} from "lucide-react";
import Swal from "sweetalert2";
import { useCartStore } from "@/lib/store/useCartStore";
import { useCartLines } from "@/lib/useCartLines";
import { formatPrice } from "@/lib/pricing";
import { authClient } from "@/lib/auth-client";
import { createOrder } from "@/lib/action/orders";

const THEME = {
    page: "bg-slate-50 min-h-[70vh] py-6 sm:py-8",
    card: "rounded-2xl border border-slate-200 bg-white p-4 sm:p-6",
    heading: "text-slate-900 font-extrabold tracking-tight text-xl sm:text-2xl",
    label: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500",
    input: "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100",
    textarea: "min-h-[88px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100",
    error: "mt-1 text-xs text-rose-600",
    submit: "w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60",
    emptyTitle: "text-lg font-semibold text-slate-800",
    emptySubtitle: "text-sm text-slate-500",
};

const TEXT = {
    title: "Checkout",
    subtitle: "Enter your details to complete the order.",
    back: "Continue shopping",
    contact: "Contact",
    shipping: "Shipping address",
    name: "Full name",
    namePlaceholder: "Jane Cooper",
    nameRequired: "Please enter your full name",
    email: "Email",
    emailPlaceholder: "jane@email.com",
    emailRequired: "Please enter your email",
    emailInvalid: "Enter a valid email address",
    phone: "Phone number",
    phonePlaceholder: "(555) 123-4567",
    phoneRequired: "Please enter your phone number",
    phoneInvalid: "Enter a valid phone number",
    address: "Street address",
    addressPlaceholder: "123 Market Street, Apt 4B",
    addressRequired: "Please enter your street address",
    city: "City",
    cityPlaceholder: "New York",
    cityRequired: "City is required",
    state: "State",
    stateRequired: "State is required",
    zip: "ZIP code",
    zipPlaceholder: "10001",
    zipRequired: "ZIP code is required",
    zipInvalid: "Enter a valid ZIP code",
    summary: "Order summary",
    subtotal: "Subtotal",
    shippingLabel: "Shipping",
    shippingNote: "Calculated after confirmation",
    payment: "Payment",
    paymentLabel: "Payment",
    paymentNote: "Cash on delivery",
    codTitle: "Cash on delivery",
    codNote: "Pay in cash when your order arrives.",
    total: "Total",
    placeOrder: "Place order",
    placing: "Placing order...",
    secure: "Your information is used only to process this order.",
    emptyTitle: "Your bag is empty",
    emptySubtitle: "Add a product before checking out.",
    shop: "Browse products",
    unavailable: "Unavailable",
    successTitle: "Order placed",
    successText: "Copy your IDs to track this order later.",
    orderIdLabel: "Order ID",
    trackingIdLabel: "Tracking ID",
    copy: "Copy",
    copied: "Copied",
    trackOrder: "Track order",
    errorTitle: "Could not place order",
    errorDefault: "Please try again in a moment.",
    unavailableItems: "One or more items are no longer available.",
};

const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
        try {
            await Promise.race([
                navigator.clipboard.writeText(value),
                new Promise((_, reject) => window.setTimeout(() => reject(new Error("timeout")), 400)),
            ]);
            return true;
        } catch {
            // Fall back to a hidden textarea copy.
        }
    }

    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.01";
    document.body.appendChild(input);
    input.focus();
    input.select();
    input.setSelectionRange(0, value.length);
    let copied = false;
    try {
        copied = document.execCommand("copy");
    } catch {
        copied = false;
    }
    input.remove();
    return copied;
};

const idRowHtml = (label, value, key) => `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;padding:10px 12px;border:1px solid #E2E8F0;border-radius:12px;background:#F8FAFC;text-align:left">
        <div style="min-width:0;flex:1">
            <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748B">${label}</p>
            <input id="mewe-${key}" value="${value}" readonly style="margin-top:4px;width:100%;border:0;background:transparent;font-size:14px;font-weight:700;color:#0F172A;outline:none" />
        </div>
        <button type="button" data-copy="${value}" style="flex-shrink:0;height:32px;padding:0 12px;border:0;border-radius:8px;background:#0D9488;color:#fff;font-size:12px;font-weight:600;cursor:pointer">${TEXT.copy}</button>
    </div>
`;

const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const closeCart = useCartStore((state) => state.closeCart);
    const { lines, loading, subtotal } = useCartLines(items);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip: "",
        },
    });

    useEffect(() => {
        closeCart();
    }, [closeCart]);

    useEffect(() => {
        if (!user) return;
        reset((values) => ({
            ...values,
            name: values.name || user.name || "",
            email: values.email || user.email || "",
        }));
    }, [user, reset]);

    const onSubmit = async (formData) => {
        if (!items.length) return;

        const unavailable = lines.some((line) => !line.product);
        if (loading || unavailable) {
            Swal.fire({
                icon: "error",
                title: TEXT.errorTitle,
                text: TEXT.unavailableItems,
                confirmButtonColor: "#0d9488",
            });
            return;
        }

        try {
            const res = await createOrder({
                customer: {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                },
                shippingAddress: {
                    street: formData.address.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    zip: formData.zip.trim(),
                    country: "US",
                },
                items: lines.map((line) => ({
                    slug: line.slug,
                    productId: line.product?._id,
                    quantity: line.quantity,
                    selectedAttributes: line.selectedAttributes || {},
                })),
                paymentMethod: "cod",
            });

            const trackingId = res?.data?.trackingId;
            const orderNumber = res?.data?.orderNumber;
            setOrderPlaced(true);

            await Swal.fire({
                icon: "success",
                title: TEXT.successTitle,
                html: `
                    <p style="margin:0 0 4px;font-size:14px;color:#64748B">${TEXT.successText}</p>
                    ${orderNumber ? idRowHtml(TEXT.orderIdLabel, orderNumber, "order") : ""}
                    ${trackingId ? idRowHtml(TEXT.trackingIdLabel, trackingId, "tracking") : ""}
                `,
                confirmButtonColor: "#0d9488",
                confirmButtonText: TEXT.trackOrder,
                didOpen: (popup) => {
                    popup.querySelectorAll("[data-copy]").forEach((button) => {
                        button.onclick = async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            const value = button.getAttribute("data-copy") || "";
                            const copied = value ? await copyText(value) : false;
                            button.textContent = copied ? TEXT.copied : TEXT.copy;
                            if (!copied) return;
                            window.setTimeout(() => {
                                button.textContent = TEXT.copy;
                            }, 1600);
                        };
                    });
                },
            });

            clearCart();
            router.push(trackingId ? `/track-order?id=${encodeURIComponent(trackingId)}` : "/track-order");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: TEXT.errorTitle,
                text: error?.response?.data?.message || TEXT.errorDefault,
                confirmButtonColor: "#0d9488",
            });
        }
    };

    if (items.length === 0 && !orderPlaced) {
        return (
            <main className={THEME.page}>
                <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:px-8">
                    <div className={`${THEME.card} text-center py-14`}>
                        <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-teal-600" />
                        <h1 className={THEME.emptyTitle}>{TEXT.emptyTitle}</h1>
                        <p className={`mt-1 ${THEME.emptySubtitle}`}>{TEXT.emptySubtitle}</p>
                        <Link
                            href="/product"
                            className="mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                        >
                            {TEXT.shop}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={THEME.page}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <Link href="/product" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-teal-700">
                    <ArrowLeft className="h-4 w-4" />
                    {TEXT.back}
                </Link>

                <div className="mb-5">
                    <h1 className={THEME.heading}>{TEXT.title}</h1>
                    <p className="mt-1 text-sm text-slate-500">{TEXT.subtitle}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.85fr)] md:items-start">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <section className={THEME.card}>
                            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">{TEXT.contact}</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className={THEME.label} htmlFor="checkout-name">{TEXT.name}</label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="checkout-name"
                                            type="text"
                                            placeholder={TEXT.namePlaceholder}
                                            className={`${THEME.input} pl-9`}
                                            {...register("name", {
                                                required: TEXT.nameRequired,
                                                minLength: { value: 2, message: TEXT.nameRequired },
                                            })}
                                        />
                                    </div>
                                    {errors.name && <p className={THEME.error}>{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className={THEME.label} htmlFor="checkout-email">{TEXT.email}</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="checkout-email"
                                            type="email"
                                            placeholder={TEXT.emailPlaceholder}
                                            className={`${THEME.input} pl-9`}
                                            {...register("email", {
                                                required: TEXT.emailRequired,
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: TEXT.emailInvalid,
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email && <p className={THEME.error}>{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className={THEME.label} htmlFor="checkout-phone">{TEXT.phone}</label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            id="checkout-phone"
                                            type="tel"
                                            placeholder={TEXT.phonePlaceholder}
                                            className={`${THEME.input} pl-9`}
                                            {...register("phone", {
                                                required: TEXT.phoneRequired,
                                                pattern: {
                                                    value: /^[0-9+()\-\s]{8,20}$/,
                                                    message: TEXT.phoneInvalid,
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.phone && <p className={THEME.error}>{errors.phone.message}</p>}
                                </div>
                            </div>
                        </section>

                        <section className={THEME.card}>
                            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">{TEXT.shipping}</h2>
                            <div className="grid gap-3 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <label className={THEME.label} htmlFor="checkout-address">{TEXT.address}</label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <textarea
                                            id="checkout-address"
                                            placeholder={TEXT.addressPlaceholder}
                                            className={`${THEME.textarea} pl-9`}
                                            {...register("address", { required: TEXT.addressRequired })}
                                        />
                                    </div>
                                    {errors.address && <p className={THEME.error}>{errors.address.message}</p>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label className={THEME.label} htmlFor="checkout-city">{TEXT.city}</label>
                                    <input
                                        id="checkout-city"
                                        type="text"
                                        placeholder={TEXT.cityPlaceholder}
                                        className={THEME.input}
                                        {...register("city", { required: TEXT.cityRequired })}
                                    />
                                    {errors.city && <p className={THEME.error}>{errors.city.message}</p>}
                                </div>

                                <div className="sm:col-span-1">
                                    <label className={THEME.label} htmlFor="checkout-state">{TEXT.state}</label>
                                    <select
                                        id="checkout-state"
                                        className={THEME.input}
                                        {...register("state", { required: TEXT.stateRequired })}
                                    >
                                        <option value="">—</option>
                                        {US_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    {errors.state && <p className={THEME.error}>{errors.state.message}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={THEME.label} htmlFor="checkout-zip">{TEXT.zip}</label>
                                    <input
                                        id="checkout-zip"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder={TEXT.zipPlaceholder}
                                        className={THEME.input}
                                        {...register("zip", {
                                            required: TEXT.zipRequired,
                                            pattern: {
                                                value: /^\d{5}(-\d{4})?$/,
                                                message: TEXT.zipInvalid,
                                            },
                                        })}
                                    />
                                    {errors.zip && <p className={THEME.error}>{errors.zip.message}</p>}
                                </div>
                            </div>
                        </section>

                        <section className={THEME.card}>
                            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">{TEXT.payment}</h2>
                            <label className="flex cursor-default items-start gap-3 rounded-xl border border-teal-600 bg-teal-50/60 p-3.5">
                                <input type="radio" name="paymentMethod" value="cod" checked readOnly className="mt-1 accent-teal-600" />
                                <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{TEXT.codTitle}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">{TEXT.codNote}</p>
                                </div>
                            </label>
                        </section>

                        <button type="submit" disabled={isSubmitting || loading} className={THEME.submit}>
                            {isSubmitting ? TEXT.placing : `${TEXT.placeOrder} · ${formatPrice(subtotal)}`}
                        </button>
                        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                            <Lock className="h-3.5 w-3.5" />
                            {TEXT.secure}
                        </p>
                    </form>

                    <aside className={`${THEME.card} lg:sticky lg:top-24`}>
                        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">{TEXT.summary}</h2>
                        <div className="space-y-3">
                            {loading ? (
                                Array.from({ length: Math.min(items.length, 3) }).map((_, index) => (
                                    <div key={index} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                                ))
                            ) : (
                                lines.map((line) => (
                                    <div key={line.cartItemId} className="flex gap-3">
                                        <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                            <img
                                                src={line.product?.images?.[0] || "/placeholder.jpg"}
                                                alt=""
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                {line.product?.title || TEXT.unavailable}
                                            </p>
                                            <p className="text-xs text-slate-500">Qty {line.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">{formatPrice(line.lineTotal)}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>{TEXT.subtotal}</span>
                                <span className="font-medium text-slate-800">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>{TEXT.shippingLabel}</span>
                                <span>{TEXT.shippingNote}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>{TEXT.paymentLabel}</span>
                                <span>{TEXT.paymentNote}</span>
                            </div>
                            <div className="flex justify-between pt-1 text-base font-bold text-slate-900">
                                <span>{TEXT.total}</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
