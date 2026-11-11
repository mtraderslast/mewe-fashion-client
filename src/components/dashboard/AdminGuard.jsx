"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const THEME = {
    overlay: "fixed inset-0 z-50 bg-[#F4F1EC] flex items-center justify-center",
    spinner: "h-10 w-10 rounded-full border-2 border-teal-600/20 border-t-teal-600 animate-spin",
    text: "text-sm text-[#5C6560]",
};

const TEXT = {
    checking: "Checking access...",
};

export default function AdminGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    const [timedOut, setTimedOut] = useState(false);
    const user = session?.user;
    const isAdmin = user?.role === "admin";
    const ready = !isPending || timedOut;
    const blocked = !ready || !isAdmin;

    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!ready) return;

        if (!user) {
            const redirect = encodeURIComponent(pathname || "/dashboard");
            router.replace(`/login?redirect=${redirect}`);
            return;
        }

        if (!isAdmin) {
            router.replace("/");
        }
    }, [ready, user, isAdmin, pathname, router]);

    return (
        <>
            {blocked && (
                <div className={THEME.overlay}>
                    <div className="flex flex-col items-center gap-3">
                        <div className={THEME.spinner} />
                        <p className={THEME.text}>{TEXT.checking}</p>
                    </div>
                </div>
            )}
            <div className={blocked ? "invisible pointer-events-none min-h-screen" : ""}>
                {children}
            </div>
        </>
    );
}
