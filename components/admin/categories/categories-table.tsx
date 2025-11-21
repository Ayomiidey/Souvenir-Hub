"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryWithChildren } from "@/types/category";
import { Filters } from "@/types/category";
import Link from "next/link";

export function CategoriesTable({ filters }: { filters: Filters }) {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.parentId && filters.parentId !== "all")
        params.set("parentId", filters.parentId);
      if (filters.status && filters.status !== "all")
        params.set("status", filters.status);
      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(
        `/api/admin/categories?${params.toString()}`
      );
      const data = await response.json();
      setCategories(data.categories || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

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
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100/50 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          Categories ({categories.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-6"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100/50 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
        Categories ({categories.length})
      </h2>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <MoreHorizontal className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first category</p>
          <Button asChild className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white border-0">
            <Link href="/admin/categories/new">Add your first category</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-cyan-600 font-bold text-sm">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          {category.children && category.children.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Has {category.children.length} subcategories
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">/{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(category.children?.length ?? 0)}</div>
                      {category.children && category.children.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {category.children.slice(0, 2).map(child => child.name).join(", ")}
                          {category.children.length > 2 && ` +${category.children.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.sortOrder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(category.isActive)}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0 hover:bg-cyan-50"
                        >
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Edit className="h-4 w-4 text-cyan-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  disabled={p === page}
                  className={p === page ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0" : "bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
