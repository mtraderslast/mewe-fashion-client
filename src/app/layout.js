import { Roboto_Slab, Patua_One } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-roboto-slab",
    display: "swap",
});

const patuaOne = Patua_One({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-patua",
    display: "swap",
});

export const metadata = {
    title: "MEWE Fashion",
    description: "",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${robotoSlab.variable} ${patuaOne.variable} h-full antialiased`}
        >
            <body className="bg-slate-50 text-slate-900 min-h-screen">
                {children}
            </body>
        </html>
    );
}