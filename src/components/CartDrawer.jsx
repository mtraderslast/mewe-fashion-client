"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { getUnitPricing, findMatchingVariant } from "@/lib/pricing";
import { allProducts } from "@/data/product";

const CART_THEME = {
    overlayBg: "bg-slate-950/60 backdrop-blur-xs",
    drawerBg: "bg-white border-l border-slate-200",
    headerBg: "bg-white border-b border-slate-200",
    bodyBg: "bg-slate-50/50",
    footerBg: "bg-white border-t border-slate-200",

    headingText: "text-slate-900 font-bold",
    subText: "text-slate-500",
    primaryText: "text-slate-900",

    accentColor: "text-teal-600",
    accentBg: "bg-teal-600 hover:bg-teal-700 text-white",
    borderLight: "border-slate-200",

    cardBg: "bg-white border border-slate-200 shadow-2xs",
    badgeBg: "bg-slate-100 text-slate-700 border border-slate-200",
    deleteIcon: "text-slate-400 hover:text-rose-600",
};

const CART_TEXT = {
    title: "Shopping Bag",
    itemsUnit: "items",
    emptyTitle: "Your Bag is Empty",
    emptySubtitle: "Browse our store to add your favorite products",
    startShopping: "Start Shopping",
    subtotalLabel: "Subtotal",
    shippingLabel: "Shipping",
    shippingNote: "Calculated at checkout",
    checkoutBtn: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
};

const getProductBySlug = (slug) => allProducts.find((product) => product.slug === slug);

export default function CartDrawer() {
    const [mounted, setMounted] = useState(false);

    const items = useCartStore((state) => state.items);
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const totalCount = useCartStore((state) => state.getTotalItems());

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const getItemFinalPrice = (cartItem, product) => {
        if (!product) return 0;
        const matchedVariant = findMatchingVariant(product, cartItem.selectedAttributes);
        return getUnitPricing(product, matchedVariant).finalPrice;
    };

    const subtotal = useMemo(() => {
        return items.reduce((total, cartItem) => {
            const product = getProductBySlug(cartItem.slug);
            const finalPrice = getItemFinalPrice(cartItem, product);
            return total + finalPrice * cartItem.quantity;
        }, 0);
    }, [items]);

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-labelledby="slide-over-title"
            role="dialog"
            aria-modal="true"
        >
            <div className={`fixed inset-0 transition-opacity duration-300 ${CART_THEME.overlayBg}`} onClick={closeCart} />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
                <aside className={`w-screen max-w-md ${CART_THEME.drawerBg} shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                    <div className={`p-4 sm:p-5 flex items-center justify-between ${CART_THEME.headerBg}`}>
                        <div className="flex items-center gap-2">
                            <ShoppingBag className={`w-5 h-5 ${CART_THEME.accentColor}`} />
                            <h2 id="slide-over-title" className={`text-base sm:text-lg ${CART_THEME.headingText}`}>
                                {CART_TEXT.title} <span className={`text-xs font-normal ${CART_THEME.subText}`}>({totalCount} {CART_TEXT.itemsUnit})</span>
                            </h2>
                        </div>
                        <button type="button" onClick={closeCart} className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 ${CART_THEME.bodyBg}`}>
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                <div className={`w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center ${CART_THEME.accentColor}`}>
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-base font-medium ${CART_THEME.primaryText}`}>{CART_TEXT.emptyTitle}</p>
                                    <p className={`text-xs ${CART_THEME.subText}`}>{CART_TEXT.emptySubtitle}</p>
                                </div>
                                <button type="button" onClick={closeCart} className={`mt-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-colors shadow-xs ${CART_THEME.accentBg}`}>
                                    {CART_TEXT.startShopping}
                                </button>
                            </div>
                        ) : (
                            items.map((cartItem) => {
                                const product = getProductBySlug(cartItem.slug);
                                if (!product) return null;

                                const variantEntries = Object.entries(cartItem.selectedAttributes || {});
                                const finalPrice = getItemFinalPrice(cartItem, product);

                                return (
                                    <div key={cartItem.cartItemId} className={`flex gap-3.5 p-3 rounded-2xl ${CART_THEME.cardBg}`}>
                                        <Link href={`/product/${product.slug}`} onClick={closeCart} className="relative w-20 h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                            <img
                                                src={product.images?.[0] || "/placeholder.jpg"}
                                                alt={product.title || "Product"}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </Link>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link href={`/product/${product.slug}`} onClick={closeCart}>
                                                        <h3 className={`text-xs sm:text-sm font-semibold line-clamp-1 ${CART_THEME.primaryText}`}>{product.title}</h3>
                                                    </Link>
                                                    <button type="button" onClick={() => removeFromCart(cartItem.cartItemId)} className={`transition-colors p-1 ${CART_THEME.deleteIcon}`}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {variantEntries.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                                        {variantEntries.map(([key, value]) => (
                                                            <span key={key} className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${CART_THEME.badgeBg}`}>{key}: {value}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                                                    <button type="button" onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)} className="p-1 hover:bg-slate-200 text-slate-700 rounded-l-lg transition-colors">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className={`w-7 text-center text-xs font-semibold ${CART_THEME.primaryText}`}>{cartItem.quantity}</span>
                                                    <button type="button" onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)} className="p-1 hover:bg-slate-200 text-slate-700 rounded-r-lg transition-colors">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="text-right flex flex-col">
                                                    <span className={`text-sm font-bold ${CART_THEME.primaryText}`}>
                                                        ৳{(finalPrice * cartItem.quantity).toLocaleString()}
                                                    </span>
                                                    <span className={`text-[10px] ${CART_THEME.subText}`}>
                                                        ৳{finalPrice.toLocaleString()} x {cartItem.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className={`p-4 sm:p-5 ${CART_THEME.footerBg} space-y-3.5 shadow-lg`}>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className={CART_THEME.subText}>{CART_TEXT.subtotalLabel}</span>
                                    <span className={`text-base font-bold ${CART_THEME.primaryText}`}>
                                        ৳{subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className={`flex items-center justify-between text-xs ${CART_THEME.subText}`}>
                                    <span>{CART_TEXT.shippingLabel}</span>
                                    <span>{CART_TEXT.shippingNote}</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <Link href="/checkout" onClick={closeCart} className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] ${CART_THEME.accentBg}`}>
                                    <span>{CART_TEXT.checkoutBtn}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <button type="button" onClick={closeCart} className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 text-center transition-colors">
                                    {CART_TEXT.continueShopping}
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
