import { COMPANY } from "@/lib/company";
import CarePageShell from "./CarePageShell";

const THEME = {
    card: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
    title: "text-sm font-bold uppercase tracking-wider text-slate-800",
    body: "mt-2 text-sm leading-relaxed text-slate-600",
};

const TEXT = {
    title: "About MEWE",
    subtitle: "MEWE Fashion is the storefront. M Traders Last LLC is the company behind it.",
};

export default function AboutPage() {
    return (
        <CarePageShell title={TEXT.title} subtitle={TEXT.subtitle}>
            <section className={THEME.card}>
                <h2 className={THEME.title}>The brand</h2>
                <p className={THEME.body}>
                    MEWE Fashion is built for everyday style that still feels considered — menswear, womenswear, kids, and personal care
                    selected to work together. The storefront is designed to make browsing, checkout, and order tracking straightforward.
                </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
                <section className={THEME.card}>
                    <h2 className={THEME.title}>The company</h2>
                    <p className={THEME.body}>
                        MEWE Fashion is operated by {COMPANY.legalName}, a Florida limited liability company
                        (Doc# {COMPANY.llcDoc}). Customer orders, support, and fulfillment are processed under this entity.
                    </p>
                </section>
                <section className={THEME.card}>
                    <h2 className={THEME.title}>Where we work</h2>
                    <p className={THEME.body}>
                        {COMPANY.addressLine1}<br />
                        {COMPANY.addressLine2}<br />
                        Support hours: {COMPANY.hours}
                    </p>
                </section>
            </div>

            <section className={THEME.card}>
                <h2 className={THEME.title}>How we sell</h2>
                <p className={THEME.body}>
                    You shop on MEWE Fashion, place an order at checkout, and currently pay cash on delivery.
                    Every order receives an Order ID and a Tracking ID so you can follow fulfillment from the storefront.
                </p>
            </section>
        </CarePageShell>
    );
}
