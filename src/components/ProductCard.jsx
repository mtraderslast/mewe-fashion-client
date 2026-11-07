import Link from 'next/link';

export default function ProductCard({
    product,
    THEME,
    className = "flex-shrink-0 w-[170px] sm:w-[220px] lg:w-[250px] snap-start",
}) {
    const isSoldOut = product.stock === 0;

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : null;

    return (
        <div
            className={`${className} flex flex-col justify-between ${THEME.cardBg}`}
        >
            <div>
                {/* Product Image Box */}
                <div className="relative w-full h-[220px] sm:h-[280px] bg-slate-100 overflow-hidden">
                    <Link href={`/product/${product.slug}`}>
                        <img
                            src={product.images?.[0] || '/placeholder.jpg'}
                            alt={product.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
                        {hasDiscount && (
                            <span className={THEME.discountBadge}>
                                -{discountPercent}%
                            </span>
                        )}

                        {isSoldOut && (
                            <span className={THEME.soldOutBadge}>
                                Sold out
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                    <Link href={`/product/${product.slug}`}>
                        <h3 className={THEME.productTitle}>
                            {product.title}
                        </h3>
                    </Link>
                </div>
            </div>

            {/* Price Details */}
            <div className="p-3 sm:p-4 pt-0 flex items-center gap-2">
                <span className={THEME.currentPrice}>
                    ৳{product.discountPrice ?? product.price}
                </span>

                {hasDiscount && (
                    <span className={THEME.oldPrice}>
                        ৳{product.price}
                    </span>
                )}
            </div>
        </div>
    );
}