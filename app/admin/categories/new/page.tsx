"use client";

import { CategoryForm } from "@/components/admin/categories/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Category</h1>
        <p className="text-muted-foreground">
          Create a new category for your store
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
