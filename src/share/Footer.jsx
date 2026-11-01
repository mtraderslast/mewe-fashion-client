import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const FOOTER_COLORS = {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    accent: "#0D9488",
    accentSoft: "rgba(13, 148, 136, 0.08)",
    heading: "#0F172A",
    text: "#475569",
    muted: "#64748B",
    border: "rgba(203, 213, 225, 0.6)",
};

const FOOTER_TEXT = {
    brand: {
        name: "MEWE",
        suffix: "FASHION",
        tagline: "Style That Speaks For You.",
        description: "Discover modern fashion, timeless essentials, and thoughtfully selected styles. At MEWE Fashion, we believe great style should feel effortless.",
    },
    headings: {
        shop: "Shop",
        support: "Customer Care",
        company: "Our Company",
        social: "Follow Our Journey",
    },
    copyright: "All rights reserved.",
    bottomMessage: "Made for your everyday style.",
};

const FOOTER_LINKS = {
    shop: [
        { label: "All Products", href: "/category/all-products" },
        { label: "New Arrivals", href: "/category/new-arrivals" },
        { label: "Women's Fashion", href: "/category/women" },
        { label: "Men's Fashion", href: "/category/men" },
        { label: "Accessories", href: "/category/accessories" },
    ],
    support: [
        { label: "Contact Us", href: "/contact" },
        { label: "Frequently Asked Questions", href: "/faq" },
        { label: "Shipping Information", href: "/shipping-policy" },
        { label: "Returns & Exchanges", href: "/return-policy" },
        { label: "Track Your Order", href: "/track-order" },
    ],
    company: [
        { label: "About MEWE", href: "/about" },
        { label: "Our Collections", href: "/collections" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-and-conditions" },
    ],
};

const FOOTER_SOCIALS = [
    {
        name: "Facebook",
        icon: FaFacebook,
        href: "https://facebook.com",
    },
    {
        name: "Instagram",
        icon: FaInstagram,
        href: "https://instagram.com",
    },
    {
        name: "YouTube",
        icon: FaYoutube,
        href: "https://youtube.com",
    },
];

function FooterLinkGroup({ title, links }) {
    return (
        <div>
            <h3 className="mb-5 text-sm font-semibold tracking-wide text-[var(--footer-heading)]">
                {title}
            </h3>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center gap-1 text-sm text-[var(--footer-muted)] transition-colors duration-200 hover:text-[var(--footer-accent)]"
                        >
                            <span>{link.label}</span>
                            <ArrowUpRight
                                size={12}
                                className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    const currentYear = 2026

    const activeSocials = FOOTER_SOCIALS.filter(
        (social) => social.href.trim() !== ""
    );

    const colorVariables = {
        "--footer-bg": FOOTER_COLORS.background,
        "--footer-surface": FOOTER_COLORS.surface,
        "--footer-accent": FOOTER_COLORS.accent,
        "--footer-accent-soft": FOOTER_COLORS.accentSoft,
        "--footer-heading": FOOTER_COLORS.heading,
        "--footer-text": FOOTER_COLORS.text,
        "--footer-muted": FOOTER_COLORS.muted,
        "--footer-border": FOOTER_COLORS.border,
    };

    return (
        <footer
            style={colorVariables}
            className="w-full bg-[var(--footer-bg)] text-[var(--footer-text)] border-t border-[var(--footer-border)]"
        >
            <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

                    <div className="sm:col-span-2 lg:col-span-5">
                        <Link href="/" className="inline-block">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black leading-none tracking-[0.12em] text-[var(--footer-heading)]">
                                    {FOOTER_TEXT.brand.name}
                                </span>
                                <span className="mt-1.5 text-[11px] font-bold tracking-[0.48em] text-[var(--footer-accent)]">
                                    {FOOTER_TEXT.brand.suffix}
                                </span>
                            </div>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm font-medium text-[var(--footer-heading)]">
                            {FOOTER_TEXT.brand.tagline}
                        </p>

                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--footer-muted)]">
                            {FOOTER_TEXT.brand.description}
                        </p>

                        {activeSocials.length > 0 && (
                            <div className="mt-6">
                                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--footer-muted)]">
                                    {FOOTER_TEXT.headings.social}
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {activeSocials.map((social) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.name}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--footer-border)] bg-[var(--footer-surface)] text-[var(--footer-muted)] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[var(--footer-accent)] hover:bg-[var(--footer-accent-soft)] hover:text-[var(--footer-accent)]"
                                            >
                                                <Icon size={18} />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        <FooterLinkGroup
                            title={FOOTER_TEXT.headings.shop}
                            links={FOOTER_LINKS.shop}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <FooterLinkGroup
                            title={FOOTER_TEXT.headings.support}
                            links={FOOTER_LINKS.support}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <FooterLinkGroup
                            title={FOOTER_TEXT.headings.company}
                            links={FOOTER_LINKS.company}
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--footer-border)] bg-[var(--footer-surface)]">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-5 text-center md:flex-row md:text-left">
                    <p className="text-xs text-[var(--footer-muted)] sm:text-sm">
                        © {currentYear}{" "}
                        <span className="font-semibold text-[var(--footer-heading)]">
                            {FOOTER_TEXT.brand.name} {FOOTER_TEXT.brand.suffix}
                        </span>
                        . {FOOTER_TEXT.copyright}
                    </p>

                    <p className="hidden text-xs text-[var(--footer-muted)] xl:block">
                        {FOOTER_TEXT.bottomMessage}
                    </p>
                </div>
            </div>
        </footer>
    );
}