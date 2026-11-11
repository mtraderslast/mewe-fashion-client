'use client';

import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Truck,
    RefreshCw,
    ShoppingBag,
    Minus,
    Plus
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

const THEME = {
    layoutBg: "bg-slate-50 min-h-screen py-8",
    containerBg: "bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8",
    titleText: "text-slate-900 font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight",
    brandText: "text-teal-600 font-semibold text-sm uppercase tracking-wider",
    currentPrice: "text-rose-600 font-extrabold text-2xl sm:text-3xl",
    oldPrice: "text-slate-400 text-base sm:text-lg line-through font-medium",
    stockIn: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
    stockOut: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200",

    primaryBtn: "w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all duration-200 flex items-center justify-center gap-2",
    secondaryBtn: "w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2",
    outlineBtn: "w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors",

    variantBtn: "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150",
    variantActive: "border-teal-600 bg-teal-50/60 text-teal-700 shadow-sm ring-1 ring-teal-600",
    variantInactive: "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
};

const PAGE_TEXT = {
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
};

export default function ProductDetails({ product }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [activeImage, setActiveImage] = useState(product?.images?.[0] || "");
    const [quantity, setQuantity] = useState(1);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedVolume, setSelectedVolume] = useState("");
    const [selectedScent, setSelectedScent] = useState("");

    useEffect(() => {
        if (product?.variants && product.variants.length > 0) {
            const firstVar = product.variants[0];
            if (firstVar.size) setSelectedSize(firstVar.size);
            if (firstVar.color) setSelectedColor(firstVar.color);
            if (firstVar.volume) setSelectedVolume(firstVar.volume);
            if (firstVar.scent) setSelectedScent(firstVar.scent);
        }
    }, [product]);


    const currentVariant = product.variants.find((v) => {
        let match = true;
        if (selectedSize && v.size !== selectedSize) match = false;
        if (selectedColor && v.color !== selectedColor) match = false;
        if (selectedVolume && v.volume !== selectedVolume) match = false;
        if (selectedScent && v.scent !== selectedScent) match = false;
        return match;
    }) || product.variants[0];

    const displayPrice = currentVariant?.discountPrice ?? currentVariant?.price ?? product.discountPrice ?? product.price;
    const originalPrice = currentVariant?.price ?? product.price;
    const hasDiscount = originalPrice > displayPrice;
    const currentStock = currentVariant?.stock ?? product.stock;
    const isOutOfStock = currentStock === 0;

    const availableSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
    const availableColors = [...new Set(product.variants.map(v => v.color).filter(Boolean))];
    const availableVolumes = [...new Set(product.variants.map(v => v.volume).filter(Boolean))];
    const availableScents = [...new Set(product.variants.map(v => v.scent).filter(Boolean))];

    const handleAddToCart = () => {
        if (isOutOfStock || !product?.slug) return;

        addToCart({
            slug: product.slug,
            quantity,
            selectedAttributes: {
                ...(selectedSize && { size: selectedSize }),
                ...(selectedColor && { color: selectedColor }),
                ...(selectedVolume && { volume: selectedVolume }),
                ...(selectedScent && { scent: selectedScent }),
            },
        });
    };

    return (
        <main className={THEME.layoutBg}>
            <div className={THEME.containerBg}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
                        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] scrollbar-thin">
                            {product.images?.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="relative flex-1 h-[350px] sm:h-[480px] lg:h-[540px] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                            <img
                                src={activeImage || product.images?.[0]}
                                alt={product.title}
                                className="w-full h-full object-cover object-center transition-all duration-300"
                            />
                            {hasDiscount && (
                                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                                    ছাড়!
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                {product.brand && <span className={THEME.brandText}>{product.brand}</span>}
                                <div>
                                    {isOutOfStock ? (
                                        <span className={THEME.stockOut}>Stock Out</span>
                                    ) : (
                                        <span className={THEME.stockIn}>In Stock ({currentStock} items)</span>
                                    )}
                                </div>
                            </div>

                            <h1 className={THEME.titleText}>{product.title}</h1>

                            <div className="flex items-center gap-3 mt-3 pb-4 border-b border-slate-100">
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-500">SKU: <strong className="text-slate-700">{currentVariant?.sku || 'N/A'}</strong></span>
                            </div>

                            <div className="flex items-baseline gap-3 my-5">
                                <span className={THEME.currentPrice}>৳{displayPrice}</span>
                                {hasDiscount && (
                                    <span className={THEME.oldPrice}>৳{originalPrice}</span>
                                )}
                            </div>

                            {availableSizes.length > 0 && (
                                <div className="mb-5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Select Size: <span className="text-teal-600">{selectedSize}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`${THEME.variantBtn} ${selectedSize === size ? THEME.variantActive : THEME.variantInactive
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {availableColors.length > 0 && (
                                <div className="mb-5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Select Color: <span className="text-teal-600">{selectedColor}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`${THEME.variantBtn} ${selectedColor === color ? THEME.variantActive : THEME.variantInactive
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {availableVolumes.length > 0 && (
                                <div className="mb-5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Select Volume: <span className="text-teal-600">{selectedVolume}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableVolumes.map((vol) => (
                                            <button
                                                key={vol}
                                                onClick={() => setSelectedVolume(vol)}
                                                className={`${THEME.variantBtn} ${selectedVolume === vol ? THEME.variantActive : THEME.variantInactive
                                                    }`}
                                            >
                                                {vol}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {availableScents.length > 0 && (
                                <div className="mb-5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Select Scent: <span className="text-teal-600">{selectedScent}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableScents.map((scent) => (
                                            <button
                                                key={scent}
                                                onClick={() => setSelectedScent(scent)}
                                                className={`${THEME.variantBtn} ${selectedScent === scent ? THEME.variantActive : THEME.variantInactive
                                                    }`}
                                            >
                                                {scent}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={isOutOfStock}
                                        className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center font-bold text-slate-800 text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                                        disabled={isOutOfStock}
                                        className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                        className={`${THEME.primaryBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {PAGE_TEXT.addToCart}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <button
                                    disabled={isOutOfStock}
                                    className={THEME.secondaryBtn}
                                >
                                    {PAGE_TEXT.buyNow}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <Truck className="w-5 h-5 text-teal-600 mb-1.5" />
                                <span className="text-xs font-semibold text-slate-700">দ্রুত হোম ডেলিভারি</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <ShieldCheck className="w-5 h-5 text-teal-600 mb-1.5" />
                                <span className="text-xs font-semibold text-slate-700">১০০% অরিজিনাল পণ্য</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <RefreshCw className="w-5 h-5 text-teal-600 mb-1.5" />
                                <span className="text-xs font-semibold text-slate-700">৭ দিনের রিটার্ন গ্যারান্টি</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}