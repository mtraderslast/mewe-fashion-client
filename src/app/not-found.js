import Link from "next/link";

const THEME = {
    page: "min-h-screen bg-slate-50 flex items-center justify-center px-4",
    card: "w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)]",
    brand: "text-[11px] font-bold tracking-[0.38em] text-teal-700",
    code: "mt-5 text-6xl sm:text-7xl font-black tracking-tight text-slate-900",
    title: "mt-3 text-xl font-semibold text-slate-900",
    note: "mt-2 text-sm text-slate-500 leading-relaxed",
    actions: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3",
    primary: "inline-flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white hover:bg-teal-700",
    secondary: "inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700",
};

const TEXT = {
    brand: "MEWE FASHION",
    code: "404",
    title: "This page isn't in our collection",
    note: "The link may be broken, or the page may have moved. Head back to the storefront and keep browsing.",
    home: "Back to home",
    shop: "Browse products",
};

export default function NotFound() {
    return (
        <main className={THEME.page}>
            <div className={THEME.card}>
                <p className={THEME.brand}>{TEXT.brand}</p>
                <h1 className={THEME.code}>{TEXT.code}</h1>
                <h2 className={THEME.title}>{TEXT.title}</h2>
                <p className={THEME.note}>{TEXT.note}</p>
                <div className={THEME.actions}>
                    <Link href="/" className={THEME.primary}>
                        {TEXT.home}
                    </Link>
                    <Link href="/product" className={THEME.secondary}>
                        {TEXT.shop}
                    </Link>
                </div>
            </div>
        </main>
    );
}
