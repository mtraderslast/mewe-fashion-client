import Link from "next/link";
import { COMPANY } from "@/lib/company";
import CarePageShell from "./CarePageShell";

const THEME = {
    card: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
    title: "text-sm font-bold uppercase tracking-wider text-slate-800",
    body: "mt-2 text-sm leading-relaxed text-slate-600",
    list: "mt-3 space-y-2 text-sm text-slate-600",
};

const TEXT = {
    title: "Returns & exchanges",
    subtitle: "How to send an item back or request an exchange on a MEWE Fashion order.",
};

export default function ReturnsPage() {
    return (
        <CarePageShell title={TEXT.title} subtitle={TEXT.subtitle}>
            <div className="grid gap-4 md:grid-cols-2">
                <section className={THEME.card}>
                    <h2 className={THEME.title}>Eligible items</h2>
                    <p className={THEME.body}>
                        Unused items in original packaging, with tags attached where applicable, may be returned within 7 days of delivery.
                        Intimate, opened, washed, or damaged items are not eligible.
                    </p>
                </section>
                <section className={THEME.card}>
                    <h2 className={THEME.title}>Exchanges</h2>
                    <p className={THEME.body}>
                        Size or color exchanges depend on available stock. Start with your Order ID so we can check the matching variant before you ship anything back.
                    </p>
                </section>
                <section className={THEME.card}>
                    <h2 className={THEME.title}>How to start</h2>
                    <ul className={THEME.list}>
                        <li>Contact us with your Order ID and Tracking ID.</li>
                        <li>Tell us whether you want a return or an exchange.</li>
                        <li>Wait for confirmation before sending the parcel.</li>
                    </ul>
                </section>
                <section className={THEME.card}>
                    <h2 className={THEME.title}>Refunds</h2>
                    <p className={THEME.body}>
                        COD orders are refunded after the returned item is inspected. The method and timing are confirmed when the return is approved.
                        Shipping paid to send an item back is not refunded unless the item arrived damaged or incorrect.
                    </p>
                </section>
            </div>
            <section className={THEME.card}>
                <h2 className={THEME.title}>Need to start a return?</h2>
                <p className={THEME.body}>
                    Email {COMPANY.email} or message WhatsApp / Telegram. Include photos if the item arrived damaged.
                    {" "}
                    <Link href="/contact" className="font-semibold text-teal-700 hover:text-teal-800">
                        Open contact options
                    </Link>
                    .
                </p>
            </section>
        </CarePageShell>
    );
}
