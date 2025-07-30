"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sortBy: string;
}

interface UseHomePageFiltersProps {
  priceRange: { min: number; max: number };
}

export function useHomePageFilters({ priceRange }: UseHomePageFiltersProps) {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    inStock: false,
    sortBy: "name",
  });

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      // Navigate to products page with applied filters
      const params = new URLSearchParams();

      if (updatedFilters.search && updatedFilters.search.trim()) {
        params.set("search", updatedFilters.search);
      }
      if (updatedFilters.category && updatedFilters.category.trim()) {
        params.set("category", updatedFilters.category);
      }
      if (updatedFilters.minPrice > priceRange.min) {
        params.set("minPrice", updatedFilters.minPrice.toString());
      }
      if (updatedFilters.maxPrice < priceRange.max) {
        params.set("maxPrice", updatedFilters.maxPrice.toString());
      }
      if (updatedFilters.inStock) {
        params.set("inStock", "true");
      }
      if (updatedFilters.sortBy !== "name") {
        params.set("sortBy", updatedFilters.sortBy);
      }

      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      // Navigate to products page with filters
      router.push(url);
    },
    [filters, router, priceRange]
  );

  const getActiveFiltersCount = useCallback(() => {
    return [
      filters.search && filters.search.trim() !== "",
      filters.category && filters.category.trim() !== "",
      filters.minPrice > priceRange.min,
      filters.maxPrice < priceRange.max,
      filters.inStock,
    ].filter(Boolean).length;
  }, [filters, priceRange]);

  return {
    filters,
    handleFiltersChange,
    getActiveFiltersCount,
  };
}
