"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, PackageSearch, UserRound } from "lucide-react";
import { buildProductHref } from "@/lib/productQuery";
import { useCartStore } from "@/lib/store/useCartStore";
import { authClient } from "@/lib/auth-client";

const THEME = {
    navBg: "bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80",
    textPrimary: "text-[#55A9A0]",
    brandAccent: "text-teal-600",

    searchInput:
        "bg-white text-slate-800 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder-slate-400",

    cartBadge: "bg-rose-500 text-white",
    buttonPrimary:
        "bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200",
    avatarBtn:
        "w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-teal-600 text-white flex items-center justify-center hover:ring-2 hover:ring-teal-200 transition-all",
    menuPanel:
        "absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-[60]",
    menuItem:
        "flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors",
    menuLogout:
        "flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors",
};

const NAV_TEXT = {
    searchPlaceholder: "Search your Product...",
    mobileSearchPlaceholder: "Search...",
    login: "Login",
    profile: "Profile",
    dashboard: "Dashboard",
    track: "Track order",
    logout: "Logout",
};

export default function Navbar() {
    const router = useRouter();
    const menuRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const openCart = useCartStore((state) => state.openCart);
    const totalItems = useCartStore((state) => state.getTotalItems());
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isAdmin = user?.role === "admin";

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;

        router.push(buildProductHref({ search: query }));
        setIsMobileSearchOpen(false);
    };

    const handleLogout = async () => {
        setIsUserMenuOpen(false);
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 ${THEME.navBg}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-18">

                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="inline-block">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black leading-none tracking-[0.12em] text-gray-700">
                                    MEWE
                                </span>
                                <span className="mt-1.5 text-[11px] font-bold tracking-[0.48em] text-[#55A9A0]">
                                    FASHION
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-5 flex-1 justify-end">

                        <form
                            onSubmit={handleSearchSubmit}
                            className="hidden md:flex items-center relative w-full max-w-xs lg:max-w-md"
                        >
                            <input
                                type="text"
                                placeholder={NAV_TEXT.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full py-2 pl-4 pr-10 rounded-full text-sm outline-none transition-all duration-200 ${THEME.searchInput}`}
                            />
                            <button
                                type="submit"
                                aria-label="Search"
                                className="absolute right-3 text-slate-400 hover:text-teal-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        <button
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-teal-600 transition-colors"
                            aria-label="Open search"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={openCart}
                            aria-label="Shopping Cart"
                            className="relative p-2 text-slate-700 hover:text-teal-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className={`absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full ${THEME.cartBadge}`}>
                                    {totalItems > 9 ? "9+" : totalItems}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsUserMenuOpen((open) => !open)}
                                    aria-label="User menu"
                                    className={THEME.avatarBtn}
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </button>

                                {isUserMenuOpen && (
                                    <div className={THEME.menuPanel}>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className={THEME.menuItem}
                                        >
                                            <UserRound size={16} />
                                            <span>{NAV_TEXT.profile}</span>
                                        </Link>
                                        <Link
                                            href="/track-order"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className={THEME.menuItem}
                                        >
                                            <PackageSearch size={16} />
                                            <span>{NAV_TEXT.track}</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className={THEME.menuItem}
                                            >
                                                <LayoutDashboard size={16} />
                                                <span>{NAV_TEXT.dashboard}</span>
                                            </Link>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className={THEME.menuLogout}
                                        >
                                            <LogOut size={16} />
                                            <span>{NAV_TEXT.logout}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className={`px-5 py-2 rounded-full text-sm ${THEME.buttonPrimary}`}
                            >
                                {NAV_TEXT.login}
                            </Link>
                        )}
                    </div>
                </div>

                {isMobileSearchOpen && (
                    <div className="md:hidden pb-3">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder={NAV_TEXT.mobileSearchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full py-2 pl-4 pr-10 rounded-full text-sm outline-none ${THEME.searchInput}`}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-teal-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </header>
    );
}
