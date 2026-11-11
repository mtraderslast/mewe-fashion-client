"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORY_TREE, CATEGORY_VALUES, formatSubCategory } from "@/data/categories";
import { buildProductHref } from "@/lib/productQuery";

const THEME = {
    wrap: "rounded-xl border border-slate-200 bg-white p-3 sm:p-3.5",
    row: "flex flex-col gap-2 sm:flex-row sm:items-center",
    searchForm: "flex w-full min-w-0 sm:max-w-sm lg:max-w-md",
    searchInput:
        "h-9 min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:bg-white",
    searchBtn:
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-r-lg bg-teal-600 px-3.5 text-xs font-semibold text-white hover:bg-teal-700",
    chips: "flex flex-wrap items-center gap-1.5 sm:ml-auto",
    chip: "h-8 rounded-lg px-3 text-xs font-semibold border transition-colors",
    chipIdle: "border-slate-200 bg-white text-slate-600 hover:border-teal-600 hover:text-teal-700",
    chipActive: "border-teal-600 bg-teal-50 text-teal-800",
    offerIdle: "border-rose-200 bg-white text-rose-600 hover:border-rose-500",
    offerActive: "border-rose-500 bg-rose-50 text-rose-700",
    clear: "h-8 px-2 text-xs font-medium text-slate-500 hover:text-slate-800",
    subRow: "mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5",
};

const TEXT = {
    searchPlaceholder: "Search products",
    search: "Search",
    all: "All",
    offers: "Offers",
    clear: "Clear",
};

export default function ProductFilters({ filters }) {
    const router = useRouter();
    const [draft, setDraft] = useState(filters.search || "");
    const subCategories = CATEGORY_TREE[filters.category] || [];
    const hasFilters = Boolean(
        filters.search || filters.category || filters.subCategory || filters.showInDiscount
    );

    useEffect(() => {
        setDraft(filters.search || "");
    }, [filters.search]);

    const go = (patch) => {
        router.push(buildProductHref({ ...filters, page: "", ...patch }));
    };

    const handleSearch = (event) => {
        event.preventDefault();
        go({ search: draft.trim() });
    };

    return (
        <div className={THEME.wrap}>
            <div className={THEME.row}>
                <form onSubmit={handleSearch} className={THEME.searchForm}>
                    <input
                        type="search"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder={TEXT.searchPlaceholder}
                        aria-label={TEXT.searchPlaceholder}
                        className={THEME.searchInput}
                    />
                    <button type="submit" className={THEME.searchBtn}>
                        <Search size={14} />
                        {TEXT.search}
                    </button>
                </form>

                <div className={`${THEME.chips} lg:ml-auto`}>
                    <button
                        type="button"
                        className={`${THEME.chip} ${!filters.category ? THEME.chipActive : THEME.chipIdle}`}
                        onClick={() => go({ category: "", subCategory: "" })}
                    >
                        {TEXT.all}
                    </button>
                    {CATEGORY_VALUES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`${THEME.chip} ${filters.category === category ? THEME.chipActive : THEME.chipIdle}`}
                            onClick={() => go({ category, subCategory: "" })}
                        >
                            {category}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`${THEME.chip} ${filters.showInDiscount === "true" ? THEME.offerActive : THEME.offerIdle}`}
                        onClick={() =>
                            go({ showInDiscount: filters.showInDiscount === "true" ? "" : "true" })
                        }
                    >
                        {TEXT.offers}
                    </button>
                    {hasFilters && (
                        <button type="button" className={THEME.clear} onClick={() => router.push("/product")}>
                            {TEXT.clear}
                        </button>
                    )}
                </div>
            </div>

            {subCategories.length > 0 && (
                <div className={THEME.subRow}>
                    {subCategories.map((subCategory) => (
                        <button
                            key={subCategory}
                            type="button"
                            className={`${THEME.chip} ${filters.subCategory === subCategory ? THEME.chipActive : THEME.chipIdle}`}
                            onClick={() =>
                                go({
                                    subCategory: filters.subCategory === subCategory ? "" : subCategory,
                                })
                            }
                        >
                            {formatSubCategory(subCategory)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
