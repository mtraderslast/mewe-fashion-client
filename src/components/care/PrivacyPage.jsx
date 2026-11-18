import { COMPANY, COMPANY_MAILTO } from "@/lib/company";
import CarePageShell from "./CarePageShell";

const THEME = {
    card: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
    title: "text-sm font-bold uppercase tracking-wider text-slate-800",
    body: "mt-2 text-sm leading-relaxed text-slate-600",
};

const TEXT = {
    title: "Privacy policy",
    subtitle: "How M Traders Last LLC handles information you share while shopping at MEWE Fashion.",
};

const SECTIONS = [
    {
        title: "Who is responsible",
        body: `${COMPANY.legalName} (“we”) operates MEWE Fashion. This policy covers personal information collected through the website, checkout, and customer support channels.`,
    },
    {
        title: "What we collect",
        body: "When you place an order we collect your name, email, phone number, and shipping address. If you contact support we also keep the messages you send. Cart contents may be stored in your browser so your bag is not lost between visits.",
    },
    {
        title: "How we use it",
        body: "We use this information to fulfill orders, contact you about delivery, prevent fraud, and respond to support requests. We do not sell your personal information.",
    },
    {
        title: "Who we share it with",
        body: "We share details only as needed to run the store — for example, carriers who deliver your order, and service providers who host the website. They may only use the information to perform that work.",
    },
    {
        title: "Retention",
        body: "Order records are kept as long as needed for fulfillment, accounting, and legal requirements. You may ask us to update or delete support-related information where the law allows.",
    },
    {
        title: "Contact",
        body: `Privacy questions can be sent to ${COMPANY.email}. You can also reach us on WhatsApp or Telegram using the details on the Contact page.`,
    },
];

export default function PrivacyPage() {
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
            <p className="text-sm text-slate-500">
                Email{" "}
                <a href={COMPANY_MAILTO} className="font-semibold text-teal-700 hover:text-teal-800">
                    {COMPANY.email}
                </a>
                {" "}for privacy requests.
            </p>
        </CarePageShell>
    );
}
