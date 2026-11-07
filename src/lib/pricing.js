const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export const getUnitPricing = (product, variant = null) => {
    const variantPrice = toNumber(variant?.price);
    const variantDiscount = toNumber(variant?.discountPrice);
    const basePrice = variantPrice > 0 ? variantPrice : toNumber(product?.price);

    let discountPrice = 0;
    if (variantDiscount > 0) {
        discountPrice = variantDiscount;
    } else if (variantPrice <= 0) {
        discountPrice = toNumber(product?.discountPrice);
    }

    const hasDiscount = discountPrice > 0 && discountPrice < basePrice;

    return {
        basePrice,
        finalPrice: hasDiscount ? discountPrice : basePrice,
        hasDiscount,
    };
};

export const findMatchingVariant = (product, selectedAttributes = {}) => {
    const variants = product?.variants || [];
    if (!variants.length) return null;

    const entries = Object.entries(selectedAttributes).filter(([, value]) => Boolean(value));
    if (!entries.length) return variants[0];

    return (
        variants.find((variant) =>
            entries.every(([key, value]) => variant[key] === value)
        ) || variants[0]
    );
};
