"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronUp, Filter, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  categories: Category[];
  priceRange: { min: number; max: number };
  currentFilters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  totalProducts: number;
  isMobile?: boolean;
}

export function ProductFilters({
  categories,
  priceRange,
  currentFilters,
  onFiltersChange,
  totalProducts,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [minPriceInput, setMinPriceInput] = useState(
    currentFilters.minPrice.toString()
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentFilters.maxPrice.toString()
  );
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isStockOpen, setIsStockOpen] = useState(true);

  // Update local state when currentFilters change
  useEffect(() => {
    setSearchTerm(currentFilters.search);
    setMinPriceInput(currentFilters.minPrice.toFixed(2));
    setMaxPriceInput(currentFilters.maxPrice.toFixed(2));
  }, [currentFilters.search, currentFilters.minPrice, currentFilters.maxPrice]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== currentFilters.search) {
        onFiltersChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentFilters.search, onFiltersChange]);

  // Handle slider price changes
  const handlePriceSliderChange = useCallback(
    (values: number[]) => {
      const [min, max] = values;
      setMinPriceInput(min.toFixed(2));
      setMaxPriceInput(max.toFixed(2));
      onFiltersChange({ minPrice: min, maxPrice: max });
    },
    [onFiltersChange]
  );

  // Handle min price input change
  const handleMinPriceChange = useCallback((value: string) => {
    setMinPriceInput(value);
  }, []);

  // Handle max price input change
  const handleMaxPriceChange = useCallback((value: string) => {
    setMaxPriceInput(value);
  }, []);

  // Handle min price input blur
  const handleMinPriceBlur = useCallback(() => {
    // Allow empty input during editing; only validate on final blur
    if (minPriceInput === "") {
      setMinPriceInput(currentFilters.minPrice.toFixed(2));
      return; // Don't update filters until a valid value is entered
    }

    let numValue = parseFloat(minPriceInput);

    // If invalid number, revert to current minPrice
    if (isNaN(numValue)) {
      setMinPriceInput(currentFilters.minPrice.toFixed(2));
      return;
    }

    // Clamp value to valid range
    numValue = Math.max(
      priceRange.min,
      Math.min(currentFilters.maxPrice, numValue)
    );
    const formattedValue = Math.round(numValue * 100) / 100;
    setMinPriceInput(formattedValue.toFixed(2));
    if (formattedValue !== currentFilters.minPrice) {
      onFiltersChange({ minPrice: formattedValue });
    }
  }, [
    minPriceInput,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    priceRange.min,
    onFiltersChange,
  ]);

  // Handle max price input blur
  const handleMaxPriceBlur = useCallback(() => {
    // Allow empty input during editing; only validate on final blur
    if (maxPriceInput === "") {
      setMaxPriceInput(currentFilters.maxPrice.toFixed(2));
      return; // Don't update filters until a valid value is entered
    }

    let numValue = parseFloat(maxPriceInput);

    // If invalid number, revert to current maxPrice
    if (isNaN(numValue)) {
      setMaxPriceInput(currentFilters.maxPrice.toFixed(2));
      return;
    }

    // Clamp value to valid range
    numValue = Math.min(
      priceRange.max,
      Math.max(currentFilters.minPrice, numValue)
    );
    const formattedValue = Math.round(numValue * 100) / 100;
    setMaxPriceInput(formattedValue.toFixed(2));
    if (formattedValue !== currentFilters.maxPrice) {
      onFiltersChange({ maxPrice: formattedValue });
    }
  }, [
    maxPriceInput,
    currentFilters.maxPrice,
    currentFilters.minPrice,
    priceRange.max,
    onFiltersChange,
  ]);

  // Handle Enter key press in price inputs
  const handlePriceKeyDown = useCallback(
    (e: React.KeyboardEvent, type: "min" | "max") => {
      if (e.key === "Enter") {
        if (type === "min") {
          handleMinPriceBlur();
        } else {
          handleMaxPriceBlur();
        }
      }
    },
    [handleMinPriceBlur, handleMaxPriceBlur]
  );

  const handleCategoryChange = useCallback(
    (categorySlug: string, checked: boolean) => {
      onFiltersChange({
        category: checked ? categorySlug : "",
      });
    },
    [onFiltersChange]
  );

  const handleStockChange = useCallback(
    (checked: boolean) => {
      onFiltersChange({ inStock: checked });
    },
    [onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setMinPriceInput(priceRange.min.toFixed(2));
    setMaxPriceInput(priceRange.max.toFixed(2));
    onFiltersChange({
      search: "",
      category: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStock: false,
    });
  }, [priceRange.min, priceRange.max, onFiltersChange]);

  const activeFiltersCount = [
    currentFilters.search,
    currentFilters.category,
    currentFilters.minPrice > priceRange.min ||
      currentFilters.maxPrice < priceRange.max,
    currentFilters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 border border-gray-200 shadow-sm rounded-lg">
      <style jsx global>{`
        .glass {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .glass {
          background: rgba(31, 41, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 640px) {
          .container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          .text-xl {
            font-size: 1.125rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300 font-[Inter]">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 glass"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-900 glass"
              aria-label="Search products"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 glass">
        <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-green-100/50 dark:hover:bg-green-900/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Categories</span>
                {isCategoriesOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {categories.length ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={currentFilters.category === category.slug}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.slug, checked === true)
                        }
                        aria-label={`Filter by ${category.name}`}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary transition-colors"
                      >
                        {category.name}
                      </Label>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-white dark:bg-gray-900 glass"
                    >
                      {category._count.products}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No categories available.
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 glass">
        <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Price Range</span>
                {isPriceOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="px-2">
                <Slider
                  value={[currentFilters.minPrice, currentFilters.maxPrice]}
                  onValueChange={handlePriceSliderChange}
                  max={priceRange.max}
                  min={priceRange.min}
                  step={0.01}
                  className="w-full"
                  aria-label="Price range slider"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Min:</span>
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-gray-900 glass"
                  >
                    ${currentFilters.minPrice.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Max:</span>
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-gray-900 glass"
                  >
                    ${currentFilters.maxPrice.toFixed(2)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="min-price"
                    className="text-xs text-muted-foreground"
                  >
                    Min Price ($)
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={minPriceInput}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    onBlur={handleMinPriceBlur}
                    onKeyDown={(e) => handlePriceKeyDown(e, "min")}
                    className="h-8 bg-white dark:bg-gray-900 glass"
                    min={priceRange.min}
                    max={priceRange.max}
                    step="0.01"
                    placeholder={priceRange.min.toFixed(2)}
                    aria-label="Minimum price"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="max-price"
                    className="text-xs text-muted-foreground"
                  >
                    Max Price ($)
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={maxPriceInput}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    onBlur={handleMaxPriceBlur}
                    onKeyDown={(e) => handlePriceKeyDown(e, "max")}
                    className="h-8 bg-white dark:bg-gray-900 glass"
                    min={priceRange.min}
                    max={priceRange.max}
                    step="0.01"
                    placeholder={priceRange.max.toFixed(2)}
                    aria-label="Maximum price"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Range: ${priceRange.min.toFixed(2)} - $
                {priceRange.max.toFixed(2)}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Stock Status */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-orange-200 dark:border-orange-800 glass">
        <Collapsible open={isStockOpen} onOpenChange={setIsStockOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Availability</span>
                {isStockOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={currentFilters.inStock}
                  onCheckedChange={handleStockChange}
                  aria-label="Filter by in stock"
                />
                <Label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary transition-colors"
                >
                  In Stock Only
                </Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Results Summary */}
      <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 border-gray-200 dark:border-gray-800 glass">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {totalProducts}
            </div>
            <div className="text-sm text-muted-foreground">Products Found</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
