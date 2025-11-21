"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { CategoryWithChildren } from "@/types/category";

export default function EditCategoryPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [initialData, setInitialData] = useState<{
    name: string;
    parentId?: string;
    sortOrder: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`);
        if (response.ok) {
          const data = (await response.json()) as CategoryWithChildren;
          setInitialData({
            name: data.name || "",
            parentId: data.parentId || undefined, // Convert null to undefined for form
            sortOrder: data.sortOrder || 0,
          });
        } else {
          console.error("Failed to fetch category:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Edit Category
          </h1>
          <p className="text-gray-600 mt-2">
            Update category information and settings
          </p>
        </div>
        <CategoryForm categoryId={id} initialData={initialData || undefined} />
      </div>
    </main>
  );
}
