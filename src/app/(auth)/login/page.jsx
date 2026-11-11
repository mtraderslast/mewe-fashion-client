import { Suspense } from "react";
import BrandLoader from "@/components/BrandLoader";
import LoginClient from "./LoginClient";

export const instant = false;

export default function LoginPage() {
    return (
        <Suspense fallback={<BrandLoader fullScreen />}>
            <LoginClient />
        </Suspense>
    );
}
