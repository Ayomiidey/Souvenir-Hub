"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface ProductFiltersProps {
  categories: Category[];
  priceRange: { min: number; max: number };
  currentFilters: {
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
  };
  onFiltersChange: (filters: Record<string, string | number | boolean>) => void;
}

export function ProductFilters({
  categories,
  priceRange,
  currentFilters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState([
    currentFilters.minPrice,
    currentFilters.maxPrice,
  ]);
  const [searchInput, setSearchInput] = useState(currentFilters.search);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
    onFiltersChange({
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ search: searchInput });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setLocalPriceRange([priceRange.min, priceRange.max]);
    onFiltersChange({
      search: "",
      category: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      inStock: false,
    });
  };

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.category ||
    currentFilters.minPrice > priceRange.min ||
    currentFilters.maxPrice < priceRange.max ||
    currentFilters.inStock;

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active filters</span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" size="sm" className="w-full">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-categories"
                checked={!currentFilters.category}
                onCheckedChange={() => onFiltersChange({ category: "" })}
              />
              <Label htmlFor="all-categories" className="text-sm font-normal">
                All Categories
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={currentFilters.category === category.slug}
                    onCheckedChange={() =>
                      onFiltersChange({
                        category:
                          currentFilters.category === category.slug
                            ? ""
                            : category.slug,
                      })
                    }
                  />
                  <Label
                    htmlFor={category.slug}
                    className="text-sm font-normal"
                  >
                    {category.name}
                  </Label>
                </div>
                {category.children && category.children.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {category.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={child.slug}
                          checked={currentFilters.category === child.slug}
                          onCheckedChange={() =>
                            onFiltersChange({
                              category:
                                currentFilters.category === child.slug
                                  ? ""
                                  : child.slug,
                            })
                          }
                        />
                        <Label
                          htmlFor={child.slug}
                          className="text-sm font-normal text-muted-foreground"
                        >
                          {child.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-xs">
                Min
              </Label>
              <Input
                id="min-price"
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => {
                  const value =
                    Number.parseInt(e.target.value) || priceRange.min;
                  const newRange = [
                    Math.max(value, priceRange.min),
                    localPriceRange[1],
                  ];
                  setLocalPriceRange(newRange);
                  handlePriceChange(newRange);
                }}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs">
                Max
              </Label>
              <Input
                id="max-price"
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => {
                  const value =
                    Number.parseInt(e.target.value) || priceRange.max;
                  const newRange = [
                    localPriceRange[0],
                    Math.min(value, priceRange.max),
                  ];
                  setLocalPriceRange(newRange);
                  handlePriceChange(newRange);
                }}
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={currentFilters.inStock}
              onCheckedChange={(checked) =>
                onFiltersChange({ inStock: checked as boolean })
              }
            />
            <Label htmlFor="in-stock" className="text-sm font-normal">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
