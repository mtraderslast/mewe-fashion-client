'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const THEME = {
    sectionBg: "bg-white py-8",
    headingText: "text-slate-900 font-extrabold tracking-tight text-xl sm:text-2xl uppercase",
    viewAllText: "text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors",
    cardBg: "bg-slate-50/80 border border-slate-200/60 rounded-2xl overflow-hidden group",
    discountBadge: "bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded",
    soldOutBadge: "bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded",
    productTitle: "text-slate-800 text-xs sm:text-sm font-medium line-clamp-2 hover:text-teal-600 transition-colors",
    currentPrice: "text-rose-600 font-bold text-xs sm:text-sm",
    oldPrice: "text-slate-400 text-xs line-through",
    arrowBtn: "w-9 h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed",
};

export default function ProductSliderSection({ title = "Mens Fashion", products = [] }) {
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = (direction) => {
        const container = document.getElementById(`slider-${title.replace(/\s+/g, '-').toLowerCase()}`);
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className={`w-full ${THEME.sectionBg}`}>
            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={THEME.headingText}>{title}</h2>

                    <div className="flex items-center gap-3">
                        <Link href={`/category/${title.toLowerCase()}`} className={THEME.viewAllText}>
                            View All
                        </Link>
                        <div className="hidden sm:flex items-center gap-1.5">
                            <button
                                onClick={() => handleScroll('left')}
                                className={THEME.arrowBtn}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleScroll('right')}
                                className={THEME.arrowBtn}
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Horizontal Scrollable Product List */}
                <div
                    id={`slider-${title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} THEME={THEME} />
                    ))}
                </div>

            </div>
        </section>
    );
}