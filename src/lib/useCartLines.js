"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProductDetails } from "@/lib/action/products";
import { findMatchingVariant, getUnitPricing } from "@/lib/pricing";

const productCache = new Map();

const getSlugsKey = (items = []) =>
    [...new Set(items.map((item) => item.slug).filter(Boolean))].join("|");

export function useCartLines(items = []) {
    const slugsKey = getSlugsKey(items);
    const [productsBySlug, setProductsBySlug] = useState({});
    const [loading, setLoading] = useState(() => slugsKey.length > 0);

    useEffect(() => {
        const slugs = slugsKey ? slugsKey.split("|") : [];

        if (!slugs.length) {
            setProductsBySlug({});
            setLoading(false);
            return;
        }

        let active = true;

        const load = async () => {
            setLoading(true);

            const entries = await Promise.all(
                slugs.map(async (slug) => {
                    if (productCache.has(slug)) return [slug, productCache.get(slug)];

                    try {
                        const res = await fetchProductDetails(slug);
                        const product = res?.data || null;
                        if (product) productCache.set(slug, product);
                        return [slug, product];
                    } catch {
                        return [slug, null];
                    }
                })
            );

            if (!active) return;
            setProductsBySlug(Object.fromEntries(entries));
            setLoading(false);
        };

        load();
        return () => {
            active = false;
        };
    }, [slugsKey]);

    const lines = useMemo(
        () =>
            items.map((item) => {
                const product = productsBySlug[item.slug] || null;
                const variant = product
                    ? findMatchingVariant(product, item.selectedAttributes)
                    : null;
                const pricing = product
                    ? getUnitPricing(product, variant)
                    : { finalPrice: 0, basePrice: 0, hasDiscount: false };

                return {
                    ...item,
                    product,
                    variant,
                    unitPrice: pricing.finalPrice,
                    lineTotal: pricing.finalPrice * item.quantity,
                };
            }),
        [items, productsBySlug]
    );

    const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
    const pending = items.some((item) => item.slug && !(item.slug in productsBySlug));

    return { lines, loading: loading || pending, subtotal };
}
