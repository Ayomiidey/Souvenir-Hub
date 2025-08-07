"use client";
import { useState } from "react";
import { CategoriesHeader } from "@/components/admin/categories/categories-header";
import { CategoriesTable } from "@/components/admin/categories/caegories-table";
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
    <div className="space-y-6">
      <CategoriesHeader onFilterChange={handleFilterChange} />
      <CategoriesTable filters={filters} />
    </div>
  );
}
