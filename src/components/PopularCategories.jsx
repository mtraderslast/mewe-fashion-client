'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const SECTION_CONFIG = {
    title: 'Popular Categories',
    sectionLabel: 'Shop by category',
    prevButtonAria: 'Previous categories',
    nextButtonAria: 'Next categories',
};

const CATEGORIES = [
    {
        id: 1,
        name: 'Smart Watches',
        image: '/categories/smart-watches.png',
        href: '/category/smart-watches',
    },
    {
        id: 2,
        name: 'In-Ear/Earbuds',
        image: '/categories/earbuds.png',
        href: '/category/earbuds',
    },
    {
        id: 3,
        name: 'Mens Chino Pant',
        image: '/categories/mens-chino-pant.png',
        href: '/category/mens-chino-pant',
    },
    {
        id: 4,
        name: 'Hair Dryers',
        image: '/categories/hair-dryers.png',
        href: '/category/hair-dryers',
    },
    {
        id: 5,
        name: "Men's Panjabi",
        image: '/categories/mens-panjabi.png',
        href: '/category/mens-panjabi',
    },
    {
        id: 6,
        name: "Women's Bottom Wear",
        image: '/categories/womens-bottom-wear.png',
        href: '/category/womens-bottom-wear',
    },
    {
        id: 7,
        name: 'Mens Casual Shirt',
        image: '/categories/mens-casual-shirt.png',
        href: '/category/mens-casual-shirt',
    },
    {
        id: 8,
        name: 'Footwear',
        image: '/categories/footwear.png',
        href: '/category/footwear',
    },
    {
        id: 9,
        name: "Men's Polo",
        image: '/categories/mens-polo.png',
        href: '/category/mens-polo',
    },
];

export default function PopularCategories() {
    const sliderRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const { scrollLeft, scrollWidth, clientWidth } = slider;
        const maxScroll = Math.max(0, scrollWidth - clientWidth);

        setCanScrollLeft(scrollLeft > 2);
        setCanScrollRight(scrollLeft < maxScroll - 2);
    }, []);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        updateScrollState();
        slider.addEventListener('scroll', updateScrollState, { passive: true });

        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(slider);

        return () => {
            slider.removeEventListener('scroll', updateScrollState);
            resizeObserver.disconnect();
        };
    }, [updateScrollState]);

    const scrollCategories = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const scrollAmount = slider.clientWidth * 0.75;
        slider.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section
            aria-label={SECTION_CONFIG.sectionLabel}
            className="w-full bg-white py-4 sm:py-6"
        >
            <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10">

                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[28px] lg:text-[30px]">
                        {SECTION_CONFIG.title}
                    </h2>

                    <div className="flex shrink-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => scrollCategories(-1)}
                            disabled={!canScrollLeft}
                            aria-label={SECTION_CONFIG.prevButtonAria}
                            className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-teal-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                            <ChevronLeft size={19} strokeWidth={1.7} />
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollCategories(1)}
                            disabled={!canScrollRight}
                            aria-label={SECTION_CONFIG.nextButtonAria}
                            className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-teal-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                            <ChevronRight size={19} strokeWidth={1.7} />
                        </button>
                    </div>
                </div>

                <div
                    ref={sliderRef}
                    className="flex w-full gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain pb-2 sm:gap-7 lg:gap-9 xl:gap-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {CATEGORIES.map((category) => (
                        <Link
                            href={category.href}
                            key={category.id}
                            className="group flex w-[132px] shrink-0 snap-start flex-col items-center text-center sm:w-[148px] lg:w-[152px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                        >
                            <div className="relative aspect-square w-full overflow-hidden rounded-full border border-slate-100 bg-gray-100 transition-all duration-300 group-hover:shadow-lg">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 639px) 132px, 152px"
                                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                                />
                            </div>

                            <h3 className="mt-2.5 w-full text-center text-[14px] font-medium leading-5 text-gray-800 transition-colors duration-300 group-hover:text-teal-600 sm:text-[15px]">
                                {category.name}
                            </h3>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}