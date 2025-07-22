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
  const [priceValues, setPriceValues] = useState([
    currentFilters.minPrice,
    currentFilters.maxPrice,
  ]);
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
    setPriceValues([currentFilters.minPrice, currentFilters.maxPrice]);
    setMinPriceInput(currentFilters.minPrice.toString());
    setMaxPriceInput(currentFilters.maxPrice.toString());
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

  // Debounced price change function
  const debouncedPriceChange = useCallback(
    (minPrice: number, maxPrice: number) => {
      const timeoutId = setTimeout(() => {
        onFiltersChange({ minPrice, maxPrice });
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [onFiltersChange]
  );

  // Handle slider price changes
  const handlePriceSliderChange = (values: number[]) => {
    const [min, max] = values;
    setPriceValues([min, max]);
    setMinPriceInput(min.toString());
    setMaxPriceInput(max.toString());
    debouncedPriceChange(min, max);
  };

  // Handle manual price input changes
  const handleMinPriceInputChange = (value: string) => {
    setMinPriceInput(value);

    // Only update if it's a valid number
    const numValue = Number.parseFloat(value);
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.max(
        priceRange.min,
        Math.min(numValue, priceValues[1])
      );
      setPriceValues([clampedValue, priceValues[1]]);
      debouncedPriceChange(clampedValue, priceValues[1]);
    }
  };

  const handleMaxPriceInputChange = (value: string) => {
    setMaxPriceInput(value);

    // Only update if it's a valid number
    const numValue = Number.parseFloat(value);
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.min(
        priceRange.max,
        Math.max(numValue, priceValues[0])
      );
      setPriceValues([priceValues[0], clampedValue]);
      debouncedPriceChange(priceValues[0], clampedValue);
    }
  };

  // Handle input blur to ensure valid values
  const handleMinPriceBlur = () => {
    const numValue = Number.parseFloat(minPriceInput);
    if (Number.isNaN(numValue) || numValue < priceRange.min) {
      setMinPriceInput(priceRange.min.toString());
      setPriceValues([priceRange.min, priceValues[1]]);
      onFiltersChange({ minPrice: priceRange.min });
    } else if (numValue > priceValues[1]) {
      setMinPriceInput(priceValues[1].toString());
      setPriceValues([priceValues[1], priceValues[1]]);
      onFiltersChange({ minPrice: priceValues[1] });
    }
  };

  const handleMaxPriceBlur = () => {
    const numValue = Number.parseFloat(maxPriceInput);
    if (Number.isNaN(numValue) || numValue > priceRange.max) {
      setMaxPriceInput(priceRange.max.toString());
      setPriceValues([priceValues[0], priceRange.max]);
      onFiltersChange({ maxPrice: priceRange.max });
    } else if (numValue < priceValues[0]) {
      setMaxPriceInput(priceValues[0].toString());
      setPriceValues([priceValues[0], priceValues[0]]);
      onFiltersChange({ maxPrice: priceValues[0] });
    }
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    onFiltersChange({
      category: checked ? categorySlug : "",
    });
  };

  const handleStockChange = (checked: boolean) => {
    onFiltersChange({ inStock: checked });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setPriceValues([priceRange.min, priceRange.max]);
    setMinPriceInput(priceRange.min.toString());
    setMaxPriceInput(priceRange.max.toString());
    onFiltersChange({
      search: "",
      category: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStock: false,
    });
  };

  const activeFiltersCount = [
    currentFilters.search,
    currentFilters.category,
    currentFilters.minPrice > priceRange.min ||
      currentFilters.maxPrice < priceRange.max,
    currentFilters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
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
              className="pl-10 bg-white dark:bg-gray-900"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
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
              {categories.map((category) => (
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
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-white dark:bg-gray-900"
                  >
                    {category._count.products}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
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
                  value={priceValues}
                  onValueChange={handlePriceSliderChange}
                  max={priceRange.max}
                  min={priceRange.min}
                  step={0.01}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Min:</span>
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-gray-900"
                  >
                    ${priceValues[0].toFixed(2)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Max:</span>
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-gray-900"
                  >
                    ${priceValues[1].toFixed(2)}
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
                    onChange={(e) => handleMinPriceInputChange(e.target.value)}
                    onBlur={handleMinPriceBlur}
                    className="h-8 bg-white dark:bg-gray-900"
                    min={priceRange.min}
                    max={priceRange.max}
                    step="0.01"
                    placeholder={priceRange.min.toString()}
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
                    onChange={(e) => handleMaxPriceInputChange(e.target.value)}
                    onBlur={handleMaxPriceBlur}
                    className="h-8 bg-white dark:bg-gray-900"
                    min={priceRange.min}
                    max={priceRange.max}
                    step="0.01"
                    placeholder={priceRange.max.toString()}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Range: ${priceRange.min} - ${priceRange.max}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Stock Status */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-orange-200 dark:border-orange-800">
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
                />
                <Label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  In Stock Only
                </Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Results Summary */}
      <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 border-gray-200 dark:border-gray-800">
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
