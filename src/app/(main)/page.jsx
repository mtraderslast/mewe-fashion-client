import HeroBanner from "@/components/HeroBanner"
import HomePageProduct from "@/components/HomePageProduct"
import OfferBannerSection from "@/components/OfferBannerSection"
import PopularCategories from "@/components/PopularCategories"

function Home() {
    return (
        <div>
            <HeroBanner />
            <PopularCategories />
            <HomePageProduct />
            <OfferBannerSection />
        </div>
    )
}

export default Home