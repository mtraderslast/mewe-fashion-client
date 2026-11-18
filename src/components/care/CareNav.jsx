"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CARE_NAV } from "@/lib/company";

const THEME = {
    aside: "rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:sticky lg:top-24",
    label: "mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400",
    list: "space-y-1",
    item: "flex h-10 items-center rounded-xl px-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-700",
    active: "bg-teal-50 text-teal-800 font-semibold hover:bg-teal-50 hover:text-teal-800",
};

const TEXT = {
    label: "Customer care",
};

export default function CareNav() {
    const pathname = usePathname();

    return (
        <aside className={THEME.aside}>
            <p className={THEME.label}>{TEXT.label}</p>
            <nav className={THEME.list}>
                {CARE_NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${THEME.item} ${active ? THEME.active : ""}`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
