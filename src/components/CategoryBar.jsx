"use client";

import Link from "next/link";
import { buildProductHref } from "@/lib/productQuery";

const THEME = {
    containerBg: "bg-white border-b border-slate-200/60 shadow-sm",
    itemBg: "bg-slate-100/80 text-slate-700",
    itemHoverBg: "hover:bg-[#e3eceb]",
    itemHoverText: "hover:text-teal-600",
    itemBorder: "border-transparent",
    itemHoverBorder: "hover:border-[#55A9A0]",
};

const CATEGORIES = [
    { name: "Shirt", icon: "👔", subCategory: "Shirt" },
    { name: "Pant", icon: "👖", subCategory: "Pant" },
    { name: "Shoes", icon: "👟", subCategory: "Shoes" },
    { name: "Watch", icon: "⌚", subCategory: "Watch" },
    { name: "Perfume", icon: "🧴", subCategory: "Perfume" },
    { name: "Dress", icon: "👗", subCategory: "Dress" },
    { name: "Burqa", icon: "🧕", subCategory: "Burqa" },
    { name: "Hijab", icon: "🧕", subCategory: "Hijab" },
    { name: "Facial Wash", icon: "🧴", subCategory: "Facial Wash" },
    { name: "Moisturizer", icon: "🧴", subCategory: "Moisturizer" },
    { name: "Baby Cream", icon: "🧴", subCategory: "Baby Cream" },
];

export default function CategoryBar() {
    return (
        <div className={`w-full ${THEME.containerBg}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none py-3">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.subCategory}
                            href={buildProductHref({ subCategory: cat.subCategory })}
                            className={`flex items-center gap-2 mx-auto flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${THEME.itemBg} ${THEME.itemHoverBg} ${THEME.itemHoverText} ${THEME.itemBorder} ${THEME.itemHoverBorder}`}
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