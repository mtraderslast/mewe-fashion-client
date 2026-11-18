import CarePageShell from "./CarePageShell";

const THEME = {
    card: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
    title: "text-sm font-bold uppercase tracking-wider text-slate-800",
    body: "mt-2 text-sm leading-relaxed text-slate-600",
    list: "mt-3 space-y-2 text-sm text-slate-600",
};

const TEXT = {
    title: "Shipping information",
    subtitle: "How MEWE Fashion prepares, ships, and tracks orders across the United States.",
};

const SECTIONS = [
    {
        title: "Coverage",
        body: "We ship to addresses within the United States. Enter a complete street address, city, state, and ZIP at checkout so the courier can deliver without delay.",
    },
    {
        title: "Processing",
        body: "Orders are reviewed and confirmed on business days. Once confirmed, items are packed and handed to a carrier. You will see fulfillment status on the tracking page as the order moves from pending to shipped.",
    },
    {
        title: "Cash on delivery",
        body: "Checkout currently uses cash on delivery. Have the order total ready when the courier arrives. Online payment options may be offered later alongside COD.",
    },
    {
        title: "Tracking",
        body: "Every order receives a unique Tracking ID (MEWE-XXXXXXXX) and Order ID. Use the Tracking ID on the Track Order page. When a carrier is assigned, that information is added to the same timeline.",
    },
    {
        title: "Delivery issues",
        body: "If a package is delayed, marked delivered but missing, or cannot be left at the address, contact support with your Tracking ID. We will check the carrier update and advise next steps.",
    },
];

export default function ShippingPage() {
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
            <section className={THEME.card}>
                <h2 className={THEME.title}>Before you order</h2>
                <ul className={THEME.list}>
                    <li>Use a reachable phone number. Couriers may call on arrival.</li>
                    <li>Confirm the shipping address matches where you can receive the package.</li>
                    <li>Keep your Tracking ID until the order is delivered.</li>
                </ul>
            </section>
        </CarePageShell>
    );
}
