import { Suspense } from "react";
import BrandLoader from "@/components/BrandLoader";
import DashboardHomeClient from "./DashboardHomeClient";

export const instant = false;

export default function DashboardHomePage() {
    return (
        <Suspense fallback={<BrandLoader />}>
            <DashboardHomeClient />
        </Suspense>
    );
}
