import ProductSliderSection from "./ProductSliderSection";

const mensProducts = [
    {
        id: 1,
        title: "Men's Essential Cotton Fabric Regular Fit Panjabi",
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80",
        href: "/products/mens-panjabi-1",
        discount: "-50%",
        currentPrice: "Tk 875.00",
        oldPrice: "Tk 1,750.00",
        isSoldOut: false,
    },
    {
        id: 2,
        title: "Men's Essential Regular Fit Panjabi With A Stylish Yoke Detail",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
        href: "/products/mens-panjabi-2",
        discount: "-50%",
        currentPrice: "Tk 925.00",
        oldPrice: "Tk 1,850.00",
        isSoldOut: true,
    },
    {
        id: 3,
        title: "Men's Essential Regular Fit Panjabi With A Stylish Yoke Detail",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
        href: "/products/mens-panjabi-3",
        discount: "-50%",
        currentPrice: "Tk 925.00",
        oldPrice: "Tk 1,850.00",
        isSoldOut: true,
    },
];

const womensProducts = [
    {
        id: 4,
        title: "Women's Exclusive Zardosi Details Silk Shalwar Kameez",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
        href: "/products/womens-kameez-1",
        discount: "-50%",
        currentPrice: "Tk 3,497.50",
        oldPrice: "Tk 6,995.00",
        isSoldOut: true,
    },
    {
        id: 5,
        title: "Women's Exclusive Lace Details Silk Mixed Shalwar Kameez",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
        href: "/products/womens-kameez-2",
        discount: "-50%",
        currentPrice: "Tk 2,825.00",
        oldPrice: "Tk 5,650.00",
        isSoldOut: false,
    },
];

const kidsProducts = [
    {
        id: 6,
        title: "Kids Festive Colorful Cotton Panjabi Set",
        image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80",
        href: "/products/kids-panjabi-1",
        discount: "-30%",
        currentPrice: "Tk 650.00",
        oldPrice: "Tk 950.00",
        isSoldOut: false,
    },
];

export default function HomePageProduct() {
    return (
        <main className="w-full">
            {/* ১. Mens Fashion সেকশন */}
            <ProductSliderSection title="Mens Fashion" products={mensProducts} />

            {/* ২. Womens Fashion সেকশন */}
            <ProductSliderSection title="Womens Fashion" products={womensProducts} />

            {/* ৩. Kids Fashion সেকশন */}
            <ProductSliderSection title="Kids Fashion" products={kidsProducts} />
        </main>
    );
}