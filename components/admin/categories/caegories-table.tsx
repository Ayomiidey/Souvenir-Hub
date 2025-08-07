"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryWithChildren } from "@/types/category";
import { Filters } from "@/types/category";
import Link from "next/link";

export function CategoriesTable({ filters }: { filters: Filters }) {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.parentId && filters.parentId !== "all")
        params.set("parentId", filters.parentId);
      if (filters.status && filters.status !== "all")
        params.set("status", filters.status);

      const response = await fetch(
        `/api/admin/categories?${params.toString()}`
      );
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteCategory = (id: string) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-950 rounded-md shadow p-4 flex items-center gap-4 text-black">
        <span>Are you sure you want to delete this category?</span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await fetch(`/api/admin/categories/${id}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  setCategories((prev) => prev.filter((cat) => cat.id !== id));
                  toast.success("Category deleted successfully!");
                } else {
                  const data = await response.json();
                  toast.error(data.message || "Failed to delete category");
                }
              } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Error deleting category");
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ));
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-muted rounded shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded shimmer w-48"></div>
              <div className="h-3 bg-muted rounded shimmer w-32"></div>
            </div>
            <div className="h-8 w-8 bg-muted rounded shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Subcategories</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sort Order</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.slug}</TableCell>
            <TableCell>
              {(category.children?.length ?? 0) > 0
                ? (category.children || [])
                    .map((child) => child.name)
                    .join(", ")
                : "None"}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(category.isActive)}>
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{category.sortOrder}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
