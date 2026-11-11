"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ShieldCheck,
    Truck,
    RefreshCw,
    ShoppingBag,
    Minus,
    Plus,
    Star,
} from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/pricing";
import { formatSubCategory } from "@/data/categories";
import ProductReviews from "@/components/ProductReviews";

const THEME = {
    page: "w-full bg-white",
    section: "w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8",
    sectionBorder: "w-full border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-8",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start",
    galleryStage:
        "relative w-full h-[380px] sm:h-[500px] lg:h-[640px] bg-slate-50 border border-slate-200 overflow-hidden",
    mainImage: "w-full h-full object-contain object-center select-none pointer-events-none",
    thumbs: "mt-3 flex gap-2.5 overflow-x-auto pb-1",
    thumb: "relative w-16 h-20 sm:w-[72px] sm:h-24 overflow-hidden flex-shrink-0 border-2 transition-colors",
    thumbActive: "border-teal-600",
    thumbIdle: "border-slate-200 opacity-70 hover:opacity-100",
    titleText: "text-slate-900 font-bold text-xl sm:text-2xl lg:text-[28px] leading-tight tracking-tight",
    brandText: "text-teal-600 font-semibold text-sm uppercase tracking-wider",
    currentPrice: "text-rose-600 font-extrabold text-2xl sm:text-3xl",
    oldPrice: "text-slate-400 text-base sm:text-lg line-through font-medium",
    stockIn: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",
    stockOut: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200",
    primaryBtn: "w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all duration-200 flex items-center justify-center gap-2",
    secondaryBtn: "w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2",
    variantBtn: "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150",
    variantActive: "border-teal-600 bg-teal-50/60 text-teal-700 shadow-sm ring-1 ring-teal-600",
    variantInactive: "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
    detailsTitle: "text-lg sm:text-xl font-semibold text-slate-900",
    detailsBody: "mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600 whitespace-pre-line",
    metaLabel: "text-[11px] font-bold uppercase tracking-wider text-slate-400",
    saleBadge: "absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md",
};

const TEXT = {
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    inStock: (count) => `In Stock (${count} items)`,
    stockOut: "Stock Out",
    sku: "SKU",
    selectSize: "Select Size",
    selectColor: "Select Color",
    selectVolume: "Select Volume",
    selectScent: "Select Scent",
    sale: "Sale",
    detailsTitle: "Product details",
    category: "Category",
    brand: "Brand",
    tags: "Tags",
    delivery: "Fast home delivery",
    original: "100% original products",
    returns: "7-day return guarantee",
    reviews: (count) => `${count} ${count === 1 ? "review" : "reviews"}`,
};

const canHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function ProductDetails({ product }) {
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addToCart);
    const [activeImage, setActiveImage] = useState(product?.images?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedVolume, setSelectedVolume] = useState("");
    const [selectedScent, setSelectedScent] = useState("");
    const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, totalReviews: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

    useEffect(() => {
        setActiveImage(product?.images?.[0] || "");
        setQuantity(1);
        setIsHovering(false);
    }, [product]);

    useEffect(() => {
        if (product?.variants && product.variants.length > 0) {
            const firstVar = product.variants[0];
            if (firstVar.size) setSelectedSize(firstVar.size);
            if (firstVar.color) setSelectedColor(firstVar.color);
            if (firstVar.volume) setSelectedVolume(firstVar.volume);
            if (firstVar.scent) setSelectedScent(firstVar.scent);
        }
    }, [product]);

    const variants = product?.variants || [];
    const images = product?.images || [];

    const currentVariant = variants.find((v) => {
        let match = true;
        if (selectedSize && v.size !== selectedSize) match = false;
        if (selectedColor && v.color !== selectedColor) match = false;
        if (selectedVolume && v.volume !== selectedVolume) match = false;
        if (selectedScent && v.scent !== selectedScent) match = false;
        return match;
    }) || variants[0];

    const displayPrice = currentVariant?.discountPrice ?? currentVariant?.price ?? product.discountPrice ?? product.price;
    const originalPrice = currentVariant?.price ?? product.price;
    const hasDiscount = originalPrice > displayPrice;
    const currentStock = currentVariant?.stock ?? product.stock;
    const isOutOfStock = currentStock === 0;

    const availableSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
    const availableColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
    const availableVolumes = [...new Set(variants.map((v) => v.volume).filter(Boolean))];
    const availableScents = [...new Set(variants.map((v) => v.scent).filter(Boolean))];

    const handleSelectImage = (img) => {
        setActiveImage(img);
        setIsHovering(false);
        setZoomOrigin({ x: 50, y: 50 });
    };

    const handleMouseEnter = () => {
        if (canHover()) setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setZoomOrigin({ x: 50, y: 50 });
    };

    const handleMouseMove = (event) => {
        if (!canHover()) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setIsHovering(true);
        setZoomOrigin({ x, y });
    };

    const getSelectedAttributes = () => ({
        ...(selectedSize && { size: selectedSize }),
        ...(selectedColor && { color: selectedColor }),
        ...(selectedVolume && { volume: selectedVolume }),
        ...(selectedScent && { scent: selectedScent }),
    });

    const handleAddToCart = () => {
        if (isOutOfStock || !product?.slug) return;

        addToCart({
            slug: product.slug,
            productId: product._id,
            quantity,
            selectedAttributes: getSelectedAttributes(),
        });
    };

    const handleBuyNow = () => {
        if (isOutOfStock || !product?.slug) return;

        addToCart({
            slug: product.slug,
            productId: product._id,
            quantity,
            selectedAttributes: getSelectedAttributes(),
            open: false,
        });
        router.push("/checkout");
    };

    return (
        <main className={THEME.page}>
            <section className={THEME.section}>
                <div className={THEME.grid}>
                    <div>
                        <div
                            className={`${THEME.galleryStage} ${isHovering ? "cursor-zoom-in" : ""}`}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleMouseMove}
                        >
                            <img
                                src={activeImage || images[0]}
                                alt={product.title}
                                className={THEME.mainImage}
                                style={{
                                    transform: isHovering ? "scale(1.7)" : "scale(1)",
                                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                                    transition: isHovering ? "none" : "transform 180ms ease",
                                }}
                            />
                            {hasDiscount && <span className={THEME.saleBadge}>{TEXT.sale}</span>}
                        </div>

                        {images.length > 1 && (
                            <div className={THEME.thumbs}>
                                {images.map((img, index) => (
                                    <button
                                        key={`${img}-${index}`}
                                        type="button"
                                        onClick={() => handleSelectImage(img)}
                                        className={`${THEME.thumb} ${activeImage === img ? THEME.thumbActive : THEME.thumbIdle}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain object-center bg-slate-50" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            {product.brand && <span className={THEME.brandText}>{product.brand}</span>}
                            {isOutOfStock ? (
                                <span className={THEME.stockOut}>{TEXT.stockOut}</span>
                            ) : (
                                <span className={THEME.stockIn}>{TEXT.inStock(currentStock)}</span>
                            )}
                        </div>

                        <h1 className={THEME.titleText}>{product.title}</h1>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            {reviewSummary.totalReviews > 0 && (
                                <a href="#reviews" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-700">
                                    <Star size={15} className="text-amber-400 fill-amber-400" />
                                    <span className="font-semibold">{reviewSummary.averageRating.toFixed(1)}</span>
                                    <span className="text-slate-400">{TEXT.reviews(reviewSummary.totalReviews)}</span>
                                </a>
                            )}
                            <span className="text-xs text-slate-500">
                                {TEXT.sku}: <strong className="text-slate-700">{currentVariant?.sku || "N/A"}</strong>
                            </span>
                        </div>

                        <div className="flex items-baseline gap-3 my-5">
                            <span className={THEME.currentPrice}>{formatPrice(displayPrice)}</span>
                            {hasDiscount && (
                                <span className={THEME.oldPrice}>{formatPrice(originalPrice)}</span>
                            )}
                        </div>

                        {availableSizes.length > 0 && (
                            <div className="mb-5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    {TEXT.selectSize}: <span className="text-teal-600">{selectedSize}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`${THEME.variantBtn} ${selectedSize === size ? THEME.variantActive : THEME.variantInactive}`}
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
                                    {TEXT.selectColor}: <span className="text-teal-600">{selectedColor}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`${THEME.variantBtn} ${selectedColor === color ? THEME.variantActive : THEME.variantInactive}`}
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
                                    {TEXT.selectVolume}: <span className="text-teal-600">{selectedVolume}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableVolumes.map((vol) => (
                                        <button
                                            key={vol}
                                            type="button"
                                            onClick={() => setSelectedVolume(vol)}
                                            className={`${THEME.variantBtn} ${selectedVolume === vol ? THEME.variantActive : THEME.variantInactive}`}
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
                                    {TEXT.selectScent}: <span className="text-teal-600">{selectedScent}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableScents.map((scent) => (
                                        <button
                                            key={scent}
                                            type="button"
                                            onClick={() => setSelectedScent(scent)}
                                            className={`${THEME.variantBtn} ${selectedScent === scent ? THEME.variantActive : THEME.variantInactive}`}
                                        >
                                            {scent}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={isOutOfStock}
                                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-slate-800 text-sm">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                                    disabled={isOutOfStock}
                                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors disabled:opacity-40"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`${THEME.primaryBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {TEXT.addToCart}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleBuyNow}
                            disabled={isOutOfStock}
                            className={`${THEME.secondaryBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {TEXT.buyNow}
                        </button>

                        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 text-center">
                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <Truck className="w-5 h-5 text-teal-600 mb-1.5" />
                                <span className="text-xs font-semibold text-slate-700">{TEXT.delivery}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <ShieldCheck className="w-5 h-5 text-teal-600 mb-1.5" />
                                <span className="text-xs font-semibold text-slate-700">{TEXT.original}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <RefreshCw className="w-5 h-5 text-teal-600 mb-1.5" />
                                <span className="text-xs font-semibold text-slate-700">{TEXT.returns}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={THEME.sectionBorder}>
                <h2 className={THEME.detailsTitle}>{TEXT.detailsTitle}</h2>
                <p className={THEME.detailsBody}>{product.description}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-slate-100">
                    <div>
                        <p className={THEME.metaLabel}>{TEXT.category}</p>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                            {product.category}
                            {product.subCategory ? ` · ${formatSubCategory(product.subCategory)}` : ""}
                        </p>
                    </div>
                    {product.brand && (
                        <div>
                            <p className={THEME.metaLabel}>{TEXT.brand}</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{product.brand}</p>
                        </div>
                    )}
                    {product.tags?.length > 0 && (
                        <div>
                            <p className={THEME.metaLabel}>{TEXT.tags}</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{product.tags.join(", ")}</p>
                        </div>
                    )}
                </div>
            </section>

            <ProductReviews
                productId={product._id}
                productSlug={product.slug}
                onSummary={setReviewSummary}
            />
        </main>
    );
}
