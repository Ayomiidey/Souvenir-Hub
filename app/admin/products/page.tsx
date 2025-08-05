"use client";
import { useState } from "react";
import { ProductsHeader } from "@/components/admin/products/products-header";
import { ProductsTable } from "@/components/admin/products/products-table";

export interface Filters {
  search: string;
  category: string;
  status: string;
}

export default function AdminProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    status: "all",
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters); // Update state with new filters
  };

  return (
    <div className="space-y-6">
      <ProductsHeader onFilterChange={handleFilterChange} />
      <ProductsTable filters={filters} /> {/* Pass filters to ProductsTable */}
    </div>
  );
}
