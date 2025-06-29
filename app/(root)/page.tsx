import { HeroSection } from "@/components/home/hero-section";
import { BestSellers } from "@/components/home/best-sellers";
import { NewArrivals } from "@/components/home/new-arrivals";
import { DealsSection } from "@/components/home/deals-section";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { FeaturesSection } from "@/components/home/features-section";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      <HeroSection />
      <div className="container">
        <BestSellers />
      </div>
      <div className="container">
        <NewArrivals />
      </div>
      <div className="bg-muted/30">
        <div className="container py-12">
          <DealsSection />
        </div>
      </div>
      <div className="container">
        <CategoriesGrid />
      </div>
      <div className="bg-muted/30">
        <div className="container py-12">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
