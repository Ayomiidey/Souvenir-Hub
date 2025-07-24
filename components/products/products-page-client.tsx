"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./product-card";
import { ProductFilters } from "./products-filter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string; slug: string };
  quantity: number;
  sku: string;
  allowCustomPrint: boolean;
  printPrice?: number | null;
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

interface ProductsPageClientProps {
  categories: Category[];
  priceRange: { min: number; max: number };
  searchParams: Record<string, string | undefined>;
}

interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sortBy: string;
}

export function ProductsPageClient({
  categories,
  priceRange,
  searchParams,
}: ProductsPageClientProps) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.search || "",
    category: searchParams.category || "",
    minPrice: Number.parseInt(
      searchParams.minPrice || priceRange.min.toString()
    ),
    maxPrice: Number.parseInt(
      searchParams.maxPrice || priceRange.max.toString()
    ),
    inStock: searchParams.inStock === "true",
    sortBy: searchParams.sortBy || "name",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.minPrice > priceRange.min)
        params.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice < priceRange.max)
        params.set("maxPrice", filters.maxPrice.toString());
      if (filters.inStock) params.set("inStock", "true");
      if (filters.sortBy !== "name") params.set("sortBy", filters.sortBy);
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalProducts(data.pagination?.total || 0);
      } else {
        console.error("Failed to fetch products:", data.message);
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1); // Reset to first page when filters change

      // Update URL
      const params = new URLSearchParams();
      const updatedFilters = { ...filters, ...newFilters };

      if (updatedFilters.search) params.set("search", updatedFilters.search);
      if (updatedFilters.category)
        params.set("category", updatedFilters.category);
      if (updatedFilters.minPrice > priceRange.min)
        params.set("minPrice", updatedFilters.minPrice.toString());
      if (updatedFilters.maxPrice < priceRange.max)
        params.set("maxPrice", updatedFilters.maxPrice.toString());
      if (updatedFilters.inStock) params.set("inStock", "true");
      if (updatedFilters.sortBy !== "name")
        params.set("sortBy", updatedFilters.sortBy);

      const newUrl = params.toString() ? `?${params.toString()}` : "";
      router.replace(`/products${newUrl}`, { scroll: false });
    },
    [filters, router, priceRange]
  );

  const handleSortChange = (sortBy: string) => {
    handleFiltersChange({ sortBy });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFiltersCount = [
    filters.search && filters.search.trim() !== "",
    filters.category && filters.category.trim() !== "",
    filters.minPrice > priceRange.min,
    filters.maxPrice < priceRange.max,
    filters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our collection of custom souvenirs and personalized gifts
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilters
                categories={categories}
                priceRange={priceRange}
                currentFilters={filters}
                onFiltersChange={handleFiltersChange}
                totalProducts={totalProducts}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters & Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Mobile Filter Button */}
              <Sheet
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden bg-white dark:bg-gray-900 shadow-sm"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
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
                      totalProducts={totalProducts}
                      isMobile={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort & View Controls */}
              <div className="flex items-center gap-4 flex-1">
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48 bg-white dark:bg-gray-900 shadow-sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="price_asc">
                      Price (Low to High)
                    </SelectItem>
                    <SelectItem value="price_desc">
                      Price (High to Low)
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-9 w-9"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-9 w-9"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
              <div className="text-sm text-muted-foreground">
                Showing {products.length} of {totalProducts} products
                {filters.search && (
                  <span> for &quot;{filters.search}&quot;</span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {activeFiltersCount} filter
                  {activeFiltersCount !== 1 ? "s" : ""} applied
                </Badge>
              )}
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div
                className={cn(
                  "grid gap-3",
                  viewMode === "grid"
                    ? "grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={cn(
                  "grid gap-3",
                  viewMode === "grid"
                    ? "grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1"
                )}
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
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <Filter className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleFiltersChange({
                      search: "",
                      category: "",
                      minPrice: priceRange.min,
                      maxPrice: priceRange.max,
                      inStock: false,
                    })
                  }
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
