import { Suspense } from "react";
import ProductCatalog from "@/components/ProductCatalog";

export const instant = false;

const THEME = {
    layoutBg: "bg-slate-50 min-h-[60vh] py-5 sm:py-6",
    countText: "text-sm text-slate-500",
};

const TEXT = {
    loadingText: "Loading products...",
};

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <main className={THEME.layoutBg}>
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <p className={THEME.countText}>{TEXT.loadingText}</p>
                    </div>
                </main>
            }
        >
            <ProductCatalog />
        </Suspense>
    );
}
