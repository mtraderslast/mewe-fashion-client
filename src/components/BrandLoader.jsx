const THEME = {
    wrap: "w-full flex flex-col items-center justify-center gap-4",
    full: "min-h-screen bg-slate-50",
    section: "min-h-[50vh]",
    ring: "h-11 w-11 rounded-full border-2 border-teal-100 border-t-teal-600 animate-spin",
    brand: "text-[11px] font-bold tracking-[0.38em] text-teal-700",
    note: "text-sm text-slate-500",
};

const TEXT = {
    brand: "MEWE",
    note: "Loading...",
};

export default function BrandLoader({ fullScreen = false }) {
    return (
        <div
            className={`${THEME.wrap} ${fullScreen ? THEME.full : THEME.section}`}
            role="status"
            aria-live="polite"
            aria-label={TEXT.note}
        >
            <div className={THEME.ring} />
            <p className={THEME.brand}>{TEXT.brand}</p>
            <p className={THEME.note}>{TEXT.note}</p>
        </div>
    );
}
