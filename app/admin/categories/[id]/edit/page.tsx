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

  if (loading) return <div>Loading...</div>;

  return (
    <CategoryForm categoryId={id} initialData={initialData || undefined} />
  );
}
