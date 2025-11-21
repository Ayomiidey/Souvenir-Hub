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
import { Plus, Upload, Download, Filter } from "lucide-react";
import Link from "next/link";
import { Filters } from "@/app/admin/products/page";

export function ProductsHeader({
  onFilterChange,
}: {
  onFilterChange?: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    status: "all",
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            Product Catalog
          </h2>
          <p className="text-gray-600 text-sm">Search, filter, and manage your products</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <Link href="/admin/products/export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <Link href="/admin/products/import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px] max-w-sm">
          <div className="relative">
            <Input
              placeholder="Search products..."
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="t-shirts">T-Shirts</SelectItem>
            <SelectItem value="mugs">Mugs</SelectItem>
            <SelectItem value="home-decor">Home Decor</SelectItem>
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  );
}
