"use client";
import { useState } from "react";
import { CategoriesHeader } from "@/components/admin/categories/categories-header";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { Filters } from "@/types/category";

export default function AdminCategoriesPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    parentId: "all",
    status: "all",
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-gray-600 mt-2">
            Organize and manage your product categories
          </p>
        </div>
        <div className="space-y-6">
          <CategoriesHeader onFilterChange={handleFilterChange} />
          <CategoriesTable filters={filters} />
        </div>
      </div>
    </main>
  );
}
