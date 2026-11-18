import { COMPANY } from "@/lib/company";
import CarePageShell from "./CarePageShell";

const THEME = {
    card: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
    title: "text-sm font-bold uppercase tracking-wider text-slate-800",
    body: "mt-2 text-sm leading-relaxed text-slate-600",
};

const TEXT = {
    title: "Terms & conditions",
    subtitle: "The rules for using MEWE Fashion and buying from M Traders Last LLC.",
};

const SECTIONS = [
    {
        title: "The agreement",
        body: `By using this website or placing an order, you agree to these terms. MEWE Fashion is operated by ${COMPANY.legalName}, Florida LLC Doc# ${COMPANY.llcDoc}.`,
    },
    {
        title: "Orders",
        body: "An order is an offer to buy the items in your bag. We may decline or cancel an order if an item is out of stock, priced in error, or cannot be delivered to the address provided. Prices are shown in USD.",
    },
    {
        title: "Payment",
        body: "Checkout currently uses cash on delivery. You agree to pay the order total to the courier upon delivery. Unpaid or refused deliveries may be cancelled.",
    },
    {
        title: "Shipping and risk",
        body: "Title and risk pass when the order is delivered to the address you gave at checkout. You are responsible for providing a complete, reachable address and phone number.",
    },
    {
        title: "Returns",
        body: "Returns and exchanges follow the Returns & Exchanges page. Items must meet the eligibility rules described there.",
    },
    {
        title: "Site use",
        body: "You may not misuse the storefront, attempt unauthorized access, or copy product content for resale. Product images and descriptions are for shopping on MEWE Fashion.",
    },
    {
        title: "Limitation of liability",
        body: "To the fullest extent allowed by law, our liability for any claim related to an order is limited to the amount you paid for that order.",
    },
    {
        title: "Governing law",
        body: `These terms are governed by the laws of the State of Florida, United States, without regard to conflict-of-law rules. The company’s address is ${COMPANY.addressLine1}, ${COMPANY.addressLine2}.`,
    },
];

export default function TermsPage() {
    return (
        <CarePageShell title={TEXT.title} subtitle={TEXT.subtitle}>
            <div className="grid gap-4 md:grid-cols-2">
                {SECTIONS.map((section) => (
                    <section key={section.title} className={THEME.card}>
                        <h2 className={THEME.title}>{section.title}</h2>
                        <p className={THEME.body}>{section.body}</p>
                    </section>
                ))}
            </div>
        </CarePageShell>
    );
}
