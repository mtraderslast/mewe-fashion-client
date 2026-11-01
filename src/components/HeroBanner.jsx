
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const THEME = {
    sectionBg: "bg-transparent",
    activeDotBg: "bg-teal-600",
    inactiveDotBg: "bg-white/80 hover:bg-white",
    arrowBg: "bg-white/80 hover:bg-white text-slate-700",
};

const BANNER_CONFIG = {
    autoPlayInterval: 5000,
};

const mainSlides = [
    { id: 1, image: '/hero-banner-1.png', alt: 'Main Banner 1' },
    { id: 2, image: '/hero-banner-2.png', alt: 'Main Banner 2' },
    { id: 3, image: '/hero-banner-3.png', alt: 'Main Banner 3' },
    { id: 4, image: '/hero-banner-4.png', alt: 'Main Banner 4' },
    { id: 5, image: '/hero-banner-5.png', alt: 'Main Banner 5' },
];

const sideBanners = {
    top: {
        image: '/side-banner-1.png',
        alt: 'Side Banner Top',
        href: '/category/all-products',
    },
    bottom: {
        image: '/side-banner-2.png',
        alt: 'Side Banner Bottom',
        href: '/category/ghee',
    },
};

// Both arrows remain hidden until the banner is hovered.
// focus-visible supports keyboard navigation without
// keeping arrows visible after a mouse click.
const arrowVisibility =
    "opacity-0 pointer-events-none " +
    "group-hover:opacity-100 group-hover:pointer-events-auto " +
    "focus-visible:opacity-100 focus-visible:pointer-events-auto " +
    "transition-opacity duration-300 ease-in-out";

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide(
            (prev) => (prev + 1) % mainSlides.length
        );
    };

    const prevSlide = () => {
        setCurrentSlide(
            (prev) =>
                (prev - 1 + mainSlides.length) % mainSlides.length
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(
                (prev) => (prev + 1) % mainSlides.length
            );
        }, BANNER_CONFIG.autoPlayInterval);

        return () => clearInterval(timer);
    }, []);

    return (
        <section
            className={`w-full px-4 sm:px-6 lg:px-8 py-4 ${THEME.sectionBg}`}
        >
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left Side: Main Slider Banner */}
                <div className="lg:col-span-2 relative h-[280px] sm:h-[410px] md:h-[470px] lg:h-[520px] rounded-sm overflow-hidden shadow-sm bg-gray-100 group">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={mainSlides[currentSlide].image}
                                alt={mainSlides[currentSlide].alt}
                                fill
                                priority={currentSlide === 0}
                                sizes="(max-width: 1023px) 100vw, 66vw"
                                className="object-cover object-center w-full h-full"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Previous Arrow */}
                    <button
                        type="button"
                        onClick={prevSlide}
                        className={`
                            absolute left-3 top-1/2 -translate-y-1/2
                            w-9 h-9 rounded-full
                            flex items-center justify-center
                            shadow-md z-20
                            ${THEME.arrowBg}
                            ${arrowVisibility}
                        `}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Next Arrow */}
                    <button
                        type="button"
                        onClick={nextSlide}
                        className={`
                            absolute right-3 top-1/2 -translate-y-1/2
                            w-9 h-9 rounded-full
                            flex items-center justify-center
                            shadow-md z-20
                            ${THEME.arrowBg}
                            ${arrowVisibility}
                        `}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Pagination Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-20">
                        {mainSlides.map((slide, idx) => (
                            <button
                                type="button"
                                key={slide.id}
                                onClick={() => setCurrentSlide(idx)}
                                className={`transition-all duration-300 h-2 rounded-full ${currentSlide === idx
                                        ? `w-6 ${THEME.activeDotBg}`
                                        : `w-2 ${THEME.inactiveDotBg}`
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Two Small Promo Banners */}
                <div className="lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-4">

                    {/* Top Right Banner */}
                    <Link
                        href={sideBanners.top.href}
                        className="w-full h-full"
                    >
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className="relative h-[180px] sm:h-[200px] lg:h-[252px] w-full rounded-sm overflow-hidden shadow-sm bg-gray-100 cursor-pointer"
                        >
                            <Image
                                src={sideBanners.top.image}
                                alt={sideBanners.top.alt}
                                fill
                                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                className="object-cover object-center w-full h-full"
                            />
                        </motion.div>
                    </Link>

                    {/* Bottom Right Banner */}
                    <Link
                        href={sideBanners.bottom.href}
                        className="w-full h-full"
                    >
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className="relative h-[180px] sm:h-[200px] lg:h-[252px] w-full rounded-sm overflow-hidden shadow-sm bg-gray-100 cursor-pointer"
                        >
                            <Image
                                src={sideBanners.bottom.image}
                                alt={sideBanners.bottom.alt}
                                fill
                                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                className="object-cover object-center w-full h-full"
                            />
                        </motion.div>
                    </Link>

                </div>
            </div>
        </section>
    );
}
