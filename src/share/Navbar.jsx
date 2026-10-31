"use client";

import { useState } from "react";
import Link from "next/link";


const BRAND_CONFIG = {
    logoText: "MEWE Fashion",
    cartItemCount: 3,
};

const THEME = {
    navBg: "bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80",
    textPrimary: "text-[#55A9A0]",
    brandAccent: "text-teal-600",


    searchInput:
        "bg-white text-slate-800 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 placeholder-slate-400",

    cartBadge: "bg-rose-500 text-white",
    buttonPrimary:
        "bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm hover:shadow transition-all duration-200",
};

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
        }
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-50 ${THEME.navBg}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-18">

                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className={`text-2xl font-black tracking-tight ${THEME.textPrimary}`}>
                                {BRAND_CONFIG.logoText}
                                <span className={THEME.brandAccent}>.</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-5 flex-1 justify-end">

                        <form
                            onSubmit={handleSearchSubmit}
                            className="hidden md:flex items-center relative w-full max-w-xs lg:max-w-md"
                        >
                            <input
                                type="text"
                                placeholder="Search your Product..."
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

                        <Link
                            href="/cart"
                            aria-label="Shopping Cart"
                            className="relative p-2 text-slate-700 hover:text-teal-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className={`absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full ${THEME.cartBadge}`}>
                                0
                            </span>
                        </Link>

                        <Link
                            href="/login"
                            className={`px-5 py-2 rounded-full text-sm ${THEME.buttonPrimary}`}
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {isMobileSearchOpen && (
                    <div className="md:hidden pb-3">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
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