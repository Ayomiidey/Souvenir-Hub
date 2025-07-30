"use client";

import { useState } from "react";
import { ProductFilters } from "@/components/products/products-filter";
import { BestSellers } from "@/components/home/best-sellers";
import { NewArrivals } from "@/components/home/new-arrivals";
import { FeaturesSection } from "@/components/home/features-section";
import Carousel from "@/components/carousel/carousel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { useHomePageFilters } from "@/hooks/use-homepage-filters";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  printPrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string; slug: string };
  quantity: number;
  sku: string;
  allowCustomPrint: boolean;
  isFeatured: boolean;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface HomePageClientProps {
  data: {
    categories: Category[];
    priceRange: { min: number; max: number };
    featuredProducts: Product[];
  };
}

export function HomePageClient({ data }: HomePageClientProps) {
  const { categories, priceRange, featuredProducts } = data;
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { filters, handleFiltersChange, getActiveFiltersCount } =
    useHomePageFilters({
      priceRange,
    });

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters (Desktop) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4">
            <ProductFilters
              categories={categories}
              priceRange={priceRange}
              currentFilters={filters}
              onFiltersChange={handleFiltersChange}
              totalProducts={0}
            />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet
              open={isMobileFiltersOpen}
              onOpenChange={setIsMobileFiltersOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white dark:bg-gray-900 shadow-sm"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Products
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-primary/10 text-primary"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 overflow-y-auto bg-white dark:bg-slate-900 shadow-xl p-0"
              >
                <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b px-6 py-4 flex items-center justify-between rounded-t-lg shadow-sm">
                  <SheetTitle className="text-lg font-bold">
                    Filter Products
                  </SheetTitle>
                </div>
                <div className="mt-0 p-6">
                  <ProductFilters
                    categories={categories}
                    priceRange={priceRange}
                    currentFilters={filters}
                    onFiltersChange={handleFiltersChange}
                    totalProducts={0}
                    isMobile={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Hero Carousel */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
              <Carousel type="homepage" />
            </div>
          </div>

          {/* Best Sellers Section - Right after carousel */}
          <BestSellers products={featuredProducts} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-16">
          <NewArrivals />
        </div>

        {/* Features Section - Full width */}
        <div className="mt-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8">
          <FeaturesSection />
        </div>
      </div>
    </div>
  );
}
