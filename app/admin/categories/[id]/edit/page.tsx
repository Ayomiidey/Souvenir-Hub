/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/categories/category-form";

export default function EditCategoryPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData({
            name: data.name || "",
            parentId: data.parentId || "",
            sortOrder: data.sortOrder || 0,
          });
        } else {
          console.error("Failed to fetch category:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]);

  return <CategoryForm categoryId={id} initialData={initialData} />;
}
