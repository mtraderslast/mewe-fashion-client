import { kidsProducts, mensProducts, womensProducts } from "@/data/product";
import { buildProductHref } from "@/lib/productQuery";
import ProductSliderSection from "./ProductSliderSection";


export default function HomePageProduct() {
    return (
        <main className="w-full">
            {/* ১. Mens Fashion */}
            <ProductSliderSection
                title="Mens Fashion"
                products={mensProducts}
                viewAllHref={buildProductHref({ category: "Mens" })}
            />

            {/* ২. Womens Fashion  */}
            <ProductSliderSection
                title="Womens Fashion"
                products={womensProducts}
                viewAllHref={buildProductHref({ category: "Womens" })}
            />

            {/* ৩. Kids Fashion */}
            <ProductSliderSection
                title="Kids Fashion"
                products={kidsProducts}
                viewAllHref={buildProductHref({ category: "Kids" })}
            />
        </main>
    );
}