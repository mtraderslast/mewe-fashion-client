"use client";

import Link from "next/link";

const CATEGORIES = [
    { name: "Shirts", href: "/category/shirts", icon: "👔" },
    { name: "Pants", href: "/category/pants", icon: "👖" },
    { name: "Shoes", href: "/category/shoes", icon: "👟" },
    { name: "Womens Facial", href: "/category/womens-facial", icon: "✨" },
    { name: "Womens Fashion", href: "/category/womens-fashion", icon: "👗" },
    { name: "Watches", href: "/category/watches", icon: "⌚" },
    { name: " Bags", href: "/category/bags", icon: "👜" },
    { name: "Electronics", href: "/category/electronics", icon: "🎧" },
];

export default function CategoryBar() {
    return (
        <div className="w-full bg-white border-b border-slate-200/60 shadow-sm">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none py-3">
                    {CATEGORIES.map((cat, index) => (
                        <Link
                            key={index}
                            href={cat.href}
                            className="flex items-center gap-2 flex-shrink-0 mx-auto px-4 py-1.5 rounded-full bg-slate-100/80 hover:bg-[#e3eceb] hover:text-teal-600 text-slate-700 text-sm font-medium transition-colors border border-transparent hover:border-[#55A9A0]"
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}