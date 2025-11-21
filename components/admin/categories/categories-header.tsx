"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import Link from "next/link";
import { Filters } from "@/types/category";

export function CategoriesHeader({
  onFilterChange,
}: {
  onFilterChange?: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    parentId: "all",
    status: "all",
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-cyan-50 p-6 rounded-xl border border-green-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
            Category Catalog
          </h2>
          <p className="text-gray-600 text-sm">Search, filter, and manage your categories</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white border-0">
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px] max-w-sm">
          <div className="relative">
            <Input
              placeholder="Search categories..."
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>
        <Select
          value={filters.parentId}
          onValueChange={(value) => handleFilterChange("parentId", value)}
        >
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <SelectValue placeholder="Parent Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parents</SelectItem>
            {/* Populate dynamically in the future if needed */}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
          <Filter className="h-4 w-4 mr-2" /> Apply Filters
        </Button>
      </div>
    </div>
  );
}
