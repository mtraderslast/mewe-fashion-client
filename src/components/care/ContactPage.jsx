import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Shield } from "lucide-react";
import { COMPANY, COMPANY_MAILTO } from "@/lib/company";
import CarePageShell from "./CarePageShell";

const THEME = {
    card: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
    grid: "grid gap-4 sm:grid-cols-2",
    method: "flex gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 hover:border-teal-600/50 transition-colors",
    icon: "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700",
    label: "text-[11px] font-bold uppercase tracking-wider text-slate-400",
    value: "mt-1 text-sm font-semibold text-slate-900 break-all",
    note: "mt-1 text-xs text-slate-500",
    heading: "text-sm font-bold uppercase tracking-wider text-slate-800",
    body: "mt-2 text-sm leading-relaxed text-slate-600",
};

const TEXT = {
    title: "Contact us",
    subtitle: "MEWE Fashion is operated by M Traders Last LLC. Reach the team by email, WhatsApp, or Telegram.",
    email: "Email support",
    emailNote: "We reply during business hours.",
    whatsapp: "WhatsApp",
    whatsappNote: "Message us on WhatsApp.",
    telegram: "Telegram",
    telegramNote: "24/7 chat support via our bot.",
    phone: "Phone / WhatsApp",
    phoneNote: "Calls are answered in business hours.",
    hours: "Business hours",
    hoursNote: "Pacific Time. Messages received after hours are answered the next business day.",
    address: "Studio address",
    entity: "Legal entity",
    entityBody: "MEWE Fashion is a storefront of M Traders Last LLC, a Florida limited liability company.",
    secureBody: "Customer information is transmitted over SSL. Orders currently use cash on delivery.",
};

const METHODS = [
    {
        icon: Mail,
        label: TEXT.email,
        value: COMPANY.email,
        href: COMPANY_MAILTO,
        note: TEXT.emailNote,
    },
    {
        icon: MessageCircle,
        label: TEXT.whatsapp,
        value: COMPANY.phoneDisplay,
        href: COMPANY.whatsappUrl,
        note: TEXT.whatsappNote,
    },
    {
        icon: Send,
        label: TEXT.telegram,
        value: COMPANY.telegramHandle,
        href: COMPANY.telegramUrl,
        note: TEXT.telegramNote,
    },
    {
        icon: Phone,
        label: TEXT.phone,
        value: COMPANY.phoneDisplay,
        href: `tel:${COMPANY.phoneTel}`,
        note: TEXT.phoneNote,
    },
];

export default function ContactPage() {
    return (
        <CarePageShell title={TEXT.title} subtitle={TEXT.subtitle}>
            <section className={THEME.grid}>
                {METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                        <a
                            key={method.label}
                            href={method.href}
                            target={method.href.startsWith("http") ? "_blank" : undefined}
                            rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className={THEME.method}
                        >
                            <span className={THEME.icon}>
                                <Icon size={18} />
                            </span>
                            <span>
                                <span className={THEME.label}>{method.label}</span>
                                <span className={`block ${THEME.value}`}>{method.value}</span>
                                <span className={`block ${THEME.note}`}>{method.note}</span>
                            </span>
                        </a>
                    );
                })}
            </section>

            <div className="grid gap-4 lg:grid-cols-3">
                <section className={THEME.card}>
                    <div className="flex items-center gap-2 text-teal-700">
                        <Clock size={16} />
                        <h2 className={THEME.heading}>{TEXT.hours}</h2>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{COMPANY.hours}</p>
                    <p className={THEME.body}>{TEXT.hoursNote}</p>
                </section>

                <section className={THEME.card}>
                    <div className="flex items-center gap-2 text-teal-700">
                        <MapPin size={16} />
                        <h2 className={THEME.heading}>{TEXT.address}</h2>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                        {COMPANY.addressLine1}<br />
                        {COMPANY.addressLine2}
                    </p>
                    <p className={THEME.body}>{COMPANY.legalName}</p>
                </section>

                <section className={THEME.card}>
                    <div className="flex items-center gap-2 text-teal-700">
                        <Shield size={16} />
                        <h2 className={THEME.heading}>{TEXT.entity}</h2>
                    </div>
                    <p className={THEME.body}>{TEXT.entityBody}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">Doc# {COMPANY.llcDoc}</p>
                    <p className={THEME.note}>{TEXT.secureBody}</p>
                </section>
            </div>
        </CarePageShell>
    );
}
