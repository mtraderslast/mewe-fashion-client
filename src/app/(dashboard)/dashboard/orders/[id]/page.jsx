import { Suspense } from "react";
import BrandLoader from "@/components/BrandLoader";
import OrderDetailClient from "./OrderDetailClient";

export const instant = false;

export default function DashboardOrderDetailPage() {
    return (
        <Suspense fallback={<BrandLoader />}>
            <OrderDetailClient />
        </Suspense>
    );
}
