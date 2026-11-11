'use client';

import Image from 'next/image';
import Link from 'next/link';

const THEME = {
    sectionBg: "w-full my-0 py-0",
    overlayBg: "bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
};

const BANNER_DATA = {
    image: "/offer-banner.png",
    alt: "Exclusive Promotional Offer",
    href: "/products?offer=true",
    buttonText: "Shop Now",
    subtitle: "Special Discount Offer",
};

export default function OfferBannerSection({
    image = BANNER_DATA.image,
    alt = BANNER_DATA.alt,
    href = BANNER_DATA.href,
    buttonText = BANNER_DATA.buttonText,
    subtitle = BANNER_DATA.subtitle,
}) {
    return (
        <section className={`w-full ${THEME.sectionBg}`}>
            <Link href={href} className="block w-full">
                <div className="relative w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[640px] overflow-hidden bg-slate-900 group cursor-pointer">
                    <Image
                        src={image}
                        alt={alt}
                        fill
                        priority
                        className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className={`absolute inset-0 z-10 ${THEME.overlayBg}`} />

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                        <span className="text-white text-xs sm:text-sm md:text-base font-semibold tracking-widest uppercase transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                            {subtitle}
                        </span>
                        <div className="mt-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 ease-out">
                            <span className="px-7 py-3 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm md:text-base shadow-2xl hover:bg-teal-50 transition-colors">
                                {buttonText}
                            </span>
                        </div>
                    </div>

                    <div className="absolute top-6 left-6 w-12 h-12 sm:w-20 sm:h-20 border-t-2 border-l-2 border-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-30" />
                    <div className="absolute top-6 right-6 w-12 h-12 sm:w-20 sm:h-20 border-t-2 border-r-2 border-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-30" />
                    <div className="absolute bottom-6 left-6 w-12 h-12 sm:w-20 sm:h-20 border-b-2 border-l-2 border-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-30" />
                    <div className="absolute bottom-6 right-6 w-12 h-12 sm:w-20 sm:h-20 border-b-2 border-r-2 border-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out z-30" />

                    <div className="absolute inset-4 sm:inset-6 border border-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none z-30" />
                </div>
            </Link>
        </section>
    );
}