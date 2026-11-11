import { Suspense } from "react";
import BrandLoader from "@/components/BrandLoader";
import RegisterClient from "./RegisterClient";

export const instant = false;

export default function RegisterPage() {
    return (
        <Suspense fallback={<BrandLoader fullScreen />}>
            <RegisterClient />
        </Suspense>
    );
}
