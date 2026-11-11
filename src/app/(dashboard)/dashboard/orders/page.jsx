import { Suspense } from "react";
import BrandLoader from "@/components/BrandLoader";
import OrdersClient from "./OrdersClient";

export const instant = false;

export default function DashboardOrdersPage() {
    return (
        <Suspense fallback={<BrandLoader />}>
            <OrdersClient />
        </Suspense>
    );
}
