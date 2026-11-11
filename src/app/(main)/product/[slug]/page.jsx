import ProductDetailsLoader from "./ProductDetailsLoader";

export const instant = false;

export default async function ProductPage({ params }) {
    const { slug } = await params;
    return <ProductDetailsLoader slug={slug} />;
}
