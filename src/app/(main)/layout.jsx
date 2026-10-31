import CategoryBar from "@/components/CategoryBar"
import Navbar from "@/share/Navbar"

function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <div className="pt-16 sm:pt-18">
                <CategoryBar />
                <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
            </div>
        </>
    )
}

export default MainLayout