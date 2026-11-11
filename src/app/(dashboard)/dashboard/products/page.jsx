import { Suspense } from "react";
import BrandLoader from "@/components/BrandLoader";
import ProductsClient from "./ProductsClient";

export const instant = false;

export default function DashboardProductsPage() {
    return (
        <Suspense fallback={<BrandLoader />}>
            <ProductsClient />
        </Suspense>
    );
}
