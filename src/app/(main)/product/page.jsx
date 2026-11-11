import { Suspense } from "react";
import { kidsProducts, mensProducts, womensProducts } from "@/data/product";
import ProductCard from "@/components/ProductCard";
import {
    filterProducts,
    getProductListHeading,
    readProductFilters,
} from "@/lib/productQuery";

const THEME = {
    layoutBg: "bg-slate-50 min-h-[60vh] py-8",
    headingText: "text-slate-900 font-extrabold tracking-tight text-xl sm:text-2xl",
    countText: "text-sm text-slate-500",
    emptyTitle: "text-slate-800 font-semibold text-lg",
    emptySubtitle: "text-sm text-slate-500",
};

const CARD_THEME = {
    cardBg: "bg-white border border-slate-200/60 rounded-2xl overflow-hidden group h-full",
    discountBadge: "bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded",
    soldOutBadge: "bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded",
    productTitle: "text-slate-800 text-xs sm:text-sm font-medium line-clamp-2 hover:text-teal-600 transition-colors",
    currentPrice: "text-rose-600 font-bold text-xs sm:text-sm",
    oldPrice: "text-slate-400 text-xs line-through",
};

const PAGE_TEXT = {
    resultCount: (count) => `${count} ${count === 1 ? "product" : "products"} found`,
    emptyTitle: "No products found",
    emptySubtitle: "Try a different search or browse another category.",
    loadingText: "Loading products...",
};

const allProducts = [...mensProducts, ...womensProducts, ...kidsProducts];

async function ProductList({ searchParams }) {
    const filters = readProductFilters(await searchParams);
    const products = filterProducts(allProducts, filters);
    const heading = getProductListHeading(filters);

    return (
        <main className={THEME.layoutBg}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className={THEME.headingText}>{heading}</h1>
                    <p className={THEME.countText}>{PAGE_TEXT.resultCount(products.length)}</p>
                </div>

                {products.length === 0 ? (
                    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
                        <p className={THEME.emptyTitle}>{PAGE_TEXT.emptyTitle}</p>
                        <p className={`mt-1 ${THEME.emptySubtitle}`}>{PAGE_TEXT.emptySubtitle}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product) => (
                            <ProductCard
                                key={product.slug}
                                product={product}
                                THEME={CARD_THEME}
                                className="w-full h-full"
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function ProductsPage({ searchParams }) {
    return (
        <Suspense
            fallback={
                <main className={THEME.layoutBg}>
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <p className={THEME.countText}>{PAGE_TEXT.loadingText}</p>
                    </div>
                </main>
            }
        >
            <ProductList searchParams={searchParams} />
        </Suspense>
    );
}
