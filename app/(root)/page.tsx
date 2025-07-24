// import { HeroSection } from "@/components/home/hero-section";
import { BestSellers } from "@/components/home/best-sellers";
import { NewArrivals } from "@/components/home/new-arrivals";
import { DealsSection } from "@/components/home/deals-section";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturesSection } from "@/components/home/features-section";
import Carousel from "@/components/carousel/carousel";

export default function HomePage() {
  return (
    <div className="pb-12 mt-23">
      <div className="mx-auto max-w-7xl px-4">
        <Carousel type="homepage" />
      </div>
      {/* <div className="container mx-auto max-w-7xl px-4">
        <HeroSection />
      </div> */}
      <div className="container mx-auto max-w-7xl px-4">
        <BestSellers />
      </div>
      <div className="container mx-auto max-w-7xl px-4">
        <NewArrivals />
      </div>
      <div className="bg-muted/30">
        <div className="container py-12 mx-auto max-w-7xl px-4">
          <DealsSection />
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4">
        <CategoriesGrid />
      </div>
      <div className="bg-muted/30">
        <div className="container py-12 mx-auto max-w-7xl px-4">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
