"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CategoryWithChildren } from "@/types/category";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  parentId: z.string().optional(),
  sortOrder: z
    .number()
    .min(0, { message: "Sort order must be a positive number." }),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryFormProps {
  categoryId?: string;
  initialData?: FormData;
}

export function CategoryForm({ categoryId, initialData }: CategoryFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      parentId: undefined,
      sortOrder: 0,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    const url = categoryId
      ? `/api/admin/categories/${categoryId}`
      : "/api/admin/categories";
    const method = categoryId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          `Category ${categoryId ? "updated" : "created"} successfully!`
        );
        router.push("/admin/categories");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to save category");
      }
    } catch (error) {
      toast.error("Error saving category");
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="px-4 md:px-6 py-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {categoryId ? "Edit" : "Create"} Category Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm md:text-base">
                Category Name
              </label>
              <Input
                id="name"
                {...form.register("name")}
                required
                className="w-full"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="parentId" className="text-sm md:text-base">
                Parent Category
              </label>
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    "parentId",
                    value === "none" ? undefined : value
                  )
                }
                defaultValue={form.getValues("parentId") || "none"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top-level)</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="sortOrder" className="text-sm md:text-base">
                Sort Order
              </label>
              <Input
                id="sortOrder"
                type="number"
                {...form.register("sortOrder", { valueAsNumber: true })}
                className="w-full"
              />
              {form.formState.errors.sortOrder && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.sortOrder.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full md:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading
            ? "Saving..."
            : categoryId
              ? "Update Category"
              : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
