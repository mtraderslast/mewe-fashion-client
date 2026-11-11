"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const THEME = {
    header: "sticky top-0 z-20 h-16 bg-[#F4F1EC]/90 backdrop-blur-md border-b border-[#E4DED4] flex items-center justify-between gap-4 px-4 lg:px-8",
    menuBtn: "p-2 rounded-xl text-[#3F4A46] hover:bg-white lg:hidden",
    title: "text-lg font-semibold text-[#1B2A26]",
    subtitle: "text-xs text-[#6B7873]",
    actions: "flex items-center gap-3",
    avatar: "h-9 w-9 rounded-full bg-[#12201D] text-[#9FE0D7] flex items-center justify-center text-sm font-bold",
    userName: "hidden sm:block text-sm font-medium text-[#1B2A26]",
    logoutBtn: "p-2 rounded-xl text-[#6B7873] hover:bg-white hover:text-rose-600 transition-colors",
};

const TEXT = {
    fallbackTitle: "Dashboard",
    logout: "Logout",
};

const PAGE_META = {
    "/dashboard": { title: "Overview", subtitle: "Store performance at a glance" },
    "/dashboard/products": { title: "Products", subtitle: "Manage the MEWE catalog" },
    "/dashboard/products/add": { title: "Add Product", subtitle: "Create a new listing" },
};

const getPageMeta = (pathname) => {
    if (pathname?.includes("/dashboard/products/") && pathname.endsWith("/edit")) {
        return { title: "Edit Product", subtitle: "Update an existing listing" };
    }
    return PAGE_META[pathname] || { title: TEXT.fallbackTitle, subtitle: "" };
};

export default function DashboardHeader({ onMenuClick }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const meta = getPageMeta(pathname);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className={THEME.header}>
            <div className="flex items-center gap-3 min-w-0">
                <button type="button" onClick={onMenuClick} className={THEME.menuBtn} aria-label="Open sidebar">
                    <Menu size={20} />
                </button>
                <div className="min-w-0">
                    <h1 className={THEME.title}>{meta.title}</h1>
                    {meta.subtitle && <p className={THEME.subtitle}>{meta.subtitle}</p>}
                </div>
            </div>

            <div className={THEME.actions}>
                <Link href="/profile" className="flex items-center gap-2.5">
                    <span className={THEME.avatar}>
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                    <span className={THEME.userName}>{user?.name || "Admin"}</span>
                </Link>
                <button type="button" onClick={handleLogout} className={THEME.logoutBtn} aria-label={TEXT.logout}>
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
