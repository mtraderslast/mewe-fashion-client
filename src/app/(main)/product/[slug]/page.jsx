import { mensProducts, womensProducts, kidsProducts } from "@/data/product";
import ProductDetails from "./ProductDetails";

export default async function ProductPage({ params }) {
    const { slug } = await params;

    const allProducts = [...mensProducts, ...womensProducts, ...kidsProducts];
    const product = allProducts.find((p) => p.slug === slug);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-slate-600 font-semibold text-lg">
                Sorry, the product you are looking for does not exist.
            </div>
        );
    }

    return <ProductDetails product={product} />;
}