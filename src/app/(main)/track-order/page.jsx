import { Suspense } from "react";
import TrackOrderPage from "@/components/TrackOrderPage";

export const instant = false;

export default function TrackOrder() {
    return (
        <Suspense fallback={<main className="bg-slate-50 min-h-[50vh] px-4 py-10 text-sm text-slate-500">Loading tracker...</main>}>
            <TrackOrderPage />
        </Suspense>
    );
}
