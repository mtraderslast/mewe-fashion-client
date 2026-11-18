import { Suspense } from "react";
import { COMPANY } from "@/lib/company";
import CareNav from "./CareNav";

const THEME = {
    page: "bg-slate-50 min-h-[70vh] py-6 sm:py-8",
    kicker: "text-[11px] font-bold tracking-[0.28em] text-teal-700",
    title: "mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900",
    subtitle: "mt-2 max-w-2xl text-sm sm:text-base text-slate-500",
    grid: "mt-6 grid gap-6 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:items-start",
    legal: "mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:px-5 text-xs sm:text-sm text-slate-500",
};

const TEXT = {
    kicker: "MEWE FASHION",
    operatedBy: "Operated by",
};

export default function CarePageShell({ title, subtitle, children }) {
    return (
        <main className={THEME.page}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <header>
                    <p className={THEME.kicker}>{TEXT.kicker}</p>
                    <h1 className={THEME.title}>{title}</h1>
                    {subtitle ? <p className={THEME.subtitle}>{subtitle}</p> : null}
                </header>

                <div className={THEME.grid}>
                    <Suspense fallback={<aside className="h-64 rounded-2xl border border-slate-200 bg-white" />}>
                        <CareNav />
                    </Suspense>
                    <div className="min-w-0 space-y-5">{children}</div>
                </div>

                <p className={THEME.legal}>
                    {TEXT.operatedBy}{" "}
                    <span className="font-semibold text-slate-800">{COMPANY.legalName}</span>
                    {` · Florida LLC Doc# ${COMPANY.llcDoc} · ${COMPANY.addressLine1}, ${COMPANY.addressLine2}`}
                </p>
            </div>
        </main>
    );
}
