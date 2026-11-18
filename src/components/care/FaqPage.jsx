import Link from "next/link";
import { COMPANY } from "@/lib/company";
import CarePageShell from "./CarePageShell";

const THEME = {
    item: "rounded-2xl border border-slate-200 bg-white px-5 py-4",
    question: "cursor-pointer list-none text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden",
    answer: "mt-2 text-sm leading-relaxed text-slate-600",
};

const TEXT = {
    title: "Frequently asked questions",
    subtitle: "Quick answers about ordering, cash on delivery, shipping, and tracking with MEWE Fashion.",
};

const FAQS = [
    {
        q: "Who operates MEWE Fashion?",
        a: `MEWE Fashion is the storefront brand of ${COMPANY.legalName}, a Florida LLC (Doc# ${COMPANY.llcDoc}). Orders, support, and fulfillment are handled under that company.`,
    },
    {
        q: "How do I place an order?",
        a: "Add items to your bag, go to checkout, and enter your contact and shipping details. Checkout currently uses cash on delivery. After you place the order, save your Order ID and Tracking ID.",
    },
    {
        q: "Do you accept online payments?",
        a: "Not yet. All orders are cash on delivery. You pay the courier when the package arrives. Card and other gateways may be added later alongside COD.",
    },
    {
        q: "How do I track my order?",
        a: "Use the Tracking ID from your confirmation on the Track Order page. You can also search from Customer Care in the footer.",
    },
    {
        q: "Where do you ship?",
        a: "We ship within the United States to the address provided at checkout. Please double-check street, city, state, and ZIP so the courier can reach you.",
    },
    {
        q: "How long does delivery take?",
        a: "Most orders are confirmed within one business day, then prepared for shipment. Transit time depends on your location and the carrier assigned to the order. Tracking updates appear as fulfillment moves forward.",
    },
    {
        q: "Can I change or cancel an order?",
        a: `If the order has not shipped, contact us with your Order ID. Email ${COMPANY.email} or message WhatsApp / Telegram during ${COMPANY.hours}.`,
    },
    {
        q: "What is your return policy?",
        a: "Unused items in original condition may be returned according to the Returns & Exchanges page. Started or damaged items are not eligible.",
    },
];

export default function FaqPage() {
    return (
        <CarePageShell title={TEXT.title} subtitle={TEXT.subtitle}>
            <div className="space-y-3">
                {FAQS.map((item) => (
                    <details key={item.q} className={THEME.item}>
                        <summary className={THEME.question}>{item.q}</summary>
                        <p className={THEME.answer}>{item.a}</p>
                    </details>
                ))}
            </div>
            <p className="text-sm text-slate-500">
                Still need help?{" "}
                <Link href="/contact" className="font-semibold text-teal-700 hover:text-teal-800">
                    Contact the team
                </Link>
                .
            </p>
        </CarePageShell>
    );
}
