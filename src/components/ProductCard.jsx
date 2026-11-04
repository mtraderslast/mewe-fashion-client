import Image from 'next/image';
import Link from 'next/link';

function ProductCard({ product, THEME }) {
    return (
        <div
            className={`flex-shrink-0 w-[170px] sm:w-[220px] lg:w-[250px] snap-start flex flex-col justify-between ${THEME.cardBg}`}
        >
            <div>
                {/* Product Image Box */}
                <div className="relative w-full h-[220px] sm:h-[280px] bg-slate-100 overflow-hidden">
                    <Link href={product.href}>
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
                        {product.discount && (
                            <span className={THEME.discountBadge}>{product.discount}</span>
                        )}
                        {product.isSoldOut && (
                            <span className={THEME.soldOutBadge}>Sold out</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                    <Link href={product.href}>
                        <h3 className={THEME.productTitle}>{product.title}</h3>
                    </Link>
                </div>
            </div>

            {/* Price Details */}
            <div className="p-3 sm:p-4 pt-0 flex items-center gap-2">
                <span className={THEME.currentPrice}>{product.currentPrice}</span>
                {product.oldPrice && (
                    <span className={THEME.oldPrice}>{product.oldPrice}</span>
                )}
            </div>
        </div>
    )
}

export default ProductCard