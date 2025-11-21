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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="space-y-6">
          <ProductsHeader onFilterChange={handleFilterChange} />
          <ProductsTable filters={filters} /> {/* Pass filters to ProductsTable */}
        </div>
      </div>
    </main>
  );
}
