"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, Package, Plus, Store, X } from "lucide-react";

const THEME = {
    aside: "fixed inset-y-0 left-0 z-40 w-72 bg-[#12201D] text-[#D7E4DF] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0",
    asideClosed: "-translate-x-full",
    asideOpen: "translate-x-0",
    overlay: "fixed inset-0 z-30 bg-black/40 lg:hidden",
    brandWrap: "px-6 pt-7 pb-6 border-b border-white/10",
    brandName: "text-[28px] font-black leading-none tracking-[0.14em] text-white",
    brandSuffix: "mt-1.5 text-[10px] font-bold tracking-[0.42em] text-[#7DC7BE]",
    brandNote: "mt-4 text-[11px] tracking-wide text-[#8AA39B]",
    nav: "flex-1 px-4 py-6 space-y-1 overflow-y-auto",
    item: "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#B7C7C2] hover:bg-white/5 hover:text-white transition-colors",
    itemActive: "bg-[#55A9A0]/15 text-[#9FE0D7] hover:bg-[#55A9A0]/20 hover:text-[#9FE0D7]",
    sectionLabel: "px-3.5 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6F857F]",
    footer: "px-4 py-5 border-t border-white/10",
    storeLink: "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#B7C7C2] hover:bg-white/5 hover:text-white transition-colors",
    closeBtn: "absolute top-4 right-4 p-1.5 rounded-lg text-[#8AA39B] hover:bg-white/10 hover:text-white lg:hidden",
};

const TEXT = {
    brand: "MEWE",
    suffix: "FASHION",
    note: "Studio console",
    sectionMain: "Workspace",
    overview: "Overview",
    products: "Products",
    addProduct: "Add Product",
    orders: "Orders",
    viewStore: "View storefront",
};

const NAV_ITEMS = [
    { href: "/dashboard", label: TEXT.overview, icon: LayoutDashboard },
    { href: "/dashboard/products", label: TEXT.products, icon: Package },
    { href: "/dashboard/products/add", label: TEXT.addProduct, icon: Plus },
    { href: "/dashboard/orders", label: TEXT.orders, icon: ClipboardList },
];

const isActive = (pathname, href) => {
    if (href === "/dashboard/products") {
        return pathname === href || /\/dashboard\/products\/[^/]+\/edit$/.test(pathname);
    }
    if (href === "/dashboard/orders") {
        return pathname === href || pathname.startsWith("/dashboard/orders/");
    }
    return pathname === href;
};

export default function DashboardSidebar({ open, onClose }) {
    const pathname = usePathname();

    return (
        <>
            {open && <button type="button" aria-label="Close sidebar" className={THEME.overlay} onClick={onClose} />}

            <aside className={`${THEME.aside} ${open ? THEME.asideOpen : THEME.asideClosed}`}>
                <button type="button" onClick={onClose} className={THEME.closeBtn} aria-label="Close sidebar">
                    <X size={18} />
                </button>

                <Link href="/" className={THEME.brandWrap}>
                    <p className={THEME.brandName}>{TEXT.brand}</p>
                    <p className={THEME.brandSuffix}>{TEXT.suffix}</p>
                </Link>

                <nav className={THEME.nav}>
                    <p className={THEME.sectionLabel}>{TEXT.sectionMain}</p>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`${THEME.item} ${active ? THEME.itemActive : ""}`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={THEME.footer}>
                    <Link href="/" className={THEME.storeLink}>
                        <Store size={18} />
                        <span>{TEXT.viewStore}</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
