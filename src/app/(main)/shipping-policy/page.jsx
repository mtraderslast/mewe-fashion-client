import ShippingPage from "@/components/care/ShippingPage";

export const instant = false;

export const metadata = {
    title: "Shipping Information - MEWE Fashion",
    description: "Shipping, processing, and tracking details for MEWE Fashion orders.",
};

export default function ShippingPolicy() {
    return <ShippingPage />;
}
