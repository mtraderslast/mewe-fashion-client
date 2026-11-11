import CartDrawer from "@/components/CartDrawer"
import CategoryBar from "@/components/CategoryBar"
import Footer from "@/share/Footer"
import Navbar from "@/share/Navbar"

function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <div className="pt-16 sm:pt-18">
                <CategoryBar />
                <main>
                    {children}
                </main>
            </div>
            <Footer />
        </>
    )
}

export default MainLayout