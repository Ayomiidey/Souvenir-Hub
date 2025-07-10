"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "./product-card";
import { ProductFilters } from "./products-filter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Grid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string };
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number | null;
  sku: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface ProductsPageClientProps {
  categories: Category[];
  priceRange: { min: number; max: number };
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export function ProductsPageClient({
  categories,
  priceRange,
  searchParams,
}: ProductsPageClientProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Current filters
  const currentPage = Number.parseInt(searchParams.page || "1");
  const currentSearch = searchParams.search || "";
  const currentCategory = searchParams.category || "";
  const currentSortBy = searchParams.sortBy || "newest";
  const currentMinPrice = Number.parseFloat(
    searchParams.minPrice || priceRange.min.toString()
  );
  const currentMaxPrice = Number.parseFloat(
    searchParams.maxPrice || priceRange.max.toString()
  );
  const currentInStock = searchParams.inStock === "true";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (currentSearch) params.set("search", currentSearch);
      if (currentCategory) params.set("category", currentCategory);
      if (currentSortBy) params.set("sortBy", currentSortBy);
      if (currentMinPrice > priceRange.min)
        params.set("minPrice", currentMinPrice.toString());
      if (currentMaxPrice < priceRange.max)
        params.set("maxPrice", currentMaxPrice.toString());
      if (currentInStock) params.set("inStockOnly", "true");
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      setProducts(data.products || []);
      setTotalProducts(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentSearch,
    currentCategory,
    currentSortBy,
    currentMinPrice,
    currentMaxPrice,
    currentInStock,
    currentPage,
    priceRange.min,
    priceRange.max,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (
    newFilters: Record<string, string | number | boolean>
  ) => {
    const params = new URLSearchParams(urlSearchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value === "" ||
        value === false ||
        (typeof value === "number" && value === 0)
      ) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filters change (except when explicitly setting page)
    if (!newFilters.page) {
      params.delete("page");
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy });
  };

  const handleMobileFilterChange = (
    filters: Record<string, string | number | boolean>
  ) => {
    updateFilters(filters);
    // Auto-close mobile filter sidebar
    setIsFilterOpen(false);
  };

  const resetAllFilters = () => {
    router.push("/products");
    setIsFilterOpen(false);
  };

  return (
    <div className="container py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Products ({totalProducts})</h1>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={resetAllFilters}
                    className="w-full bg-transparent"
                  >
                    Reset All Filters
                  </Button>
                </div>
                <ProductFilters
                  categories={categories}
                  priceRange={priceRange}
                  currentFilters={{
                    search: currentSearch,
                    category: currentCategory,
                    minPrice: currentMinPrice,
                    maxPrice: currentMaxPrice,
                    inStock: currentInStock,
                  }}
                  onFiltersChange={handleMobileFilterChange}
                  isMobile={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <ProductFilters
              categories={categories}
              priceRange={priceRange}
              currentFilters={{
                search: currentSearch,
                category: currentCategory,
                minPrice: currentMinPrice,
                maxPrice: currentMaxPrice,
                inStock: currentInStock,
              }}
              onFiltersChange={updateFilters}
              isMobile={false}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Products ({totalProducts})</h1>
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select value={currentSortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Sort */}
          <div className="lg:hidden mb-4">
            <Select value={currentSortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
              <Button className="mt-4" onClick={resetAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalProducts > 12 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => updateFilters({ page: currentPage - 1 })}
                  >
                    Previous
                  </Button>
                )}
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} of {Math.ceil(totalProducts / 12)}
                </span>
                {currentPage < Math.ceil(totalProducts / 12) && (
                  <Button
                    variant="outline"
                    onClick={() => updateFilters({ page: currentPage + 1 })}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
