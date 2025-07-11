"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Search } from "lucide-react";

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
}

interface ProductFiltersProps {
  categories: Category[];
  priceRange: { min: number; max: number };
  currentFilters: FilterState;
  onFiltersChange: (filters: Record<string, string | number | boolean>) => void;
  isMobile: boolean;
}

export function ProductFilters({
  categories,
  priceRange,
  currentFilters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [localSearch, setLocalSearch] = useState(currentFilters.search);
  const [localPriceRange, setLocalPriceRange] = useState([
    currentFilters.minPrice,
    currentFilters.maxPrice,
  ]);
  const [selectedCategory, setSelectedCategory] = useState(
    currentFilters.category
  );
  const [inStockOnly, setInStockOnly] = useState(currentFilters.inStock);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  // Debounced search handler
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const timeoutId = setTimeout(() => {
        onFiltersChange({ search: searchTerm });
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [onFiltersChange]
  );

  useEffect(() => {
    if (localSearch !== currentFilters.search) {
      const cleanup = debouncedSearch(localSearch);
      return cleanup;
    }
  }, [localSearch, currentFilters.search, debouncedSearch]);

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategory = checked ? categorySlug : "";
    setSelectedCategory(newCategory);
    onFiltersChange({ category: newCategory });
  };

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
    onFiltersChange({
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked);
    onFiltersChange({ inStock: checked });
  };

  const resetFilters = () => {
    setLocalSearch("");
    setLocalPriceRange([priceRange.min, priceRange.max]);
    setSelectedCategory("");
    setInStockOnly(false);
    onFiltersChange({
      search: "",
      category: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStock: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Filter */}
      <Card>
        <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Categories</CardTitle>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={selectedCategory === category.slug}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.slug, checked === true)
                    }
                  />
                  <Label
                    htmlFor={category.slug}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    ({category._count.products})
                  </span>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Price Range</CardTitle>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isPriceOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="px-2">
                <Slider
                  value={localPriceRange}
                  onValueChange={handlePriceChange}
                  max={priceRange.max}
                  min={priceRange.min}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>${localPriceRange[0]}</span>
                <span>${localPriceRange[1]}</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Stock Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={inStockOnly}
              onCheckedChange={(checked) =>
                handleInStockChange(checked === true)
              }
            />
            <Label
              htmlFor="inStock"
              className="text-sm font-normal cursor-pointer"
            >
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Reset Filters */}
      <Button
        variant="outline"
        onClick={resetFilters}
        className="w-full bg-transparent"
      >
        Reset All Filters
      </Button>
    </div>
  );
}
