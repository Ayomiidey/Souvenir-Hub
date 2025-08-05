/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  sku: string;
  categoryId: string | undefined;
  status: string;
  isFeatured: boolean;
  allowCustomPrint: boolean;
  printPrice?: number;
  images: { url: string; altText: string; file?: File }[];
  deliveryTime?: string;
}

interface ProductFormProps {
  productId?: string; // Undefined for create, defined for edit
  initialData?: ProductFormData;
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      comparePrice: 0,
      quantity: 0,
      sku: "",
      categoryId: undefined,
      status: "ACTIVE",
      isFeatured: false,
      allowCustomPrint: false,
      printPrice: 0,
      images: [],
      deliveryTime: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();
        console.log("Raw categories data:", data.categories); // Debug to identify duplicates
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProduct = async () => {
      if (productId && !initialData) {
        try {
          const response = await fetch(`/api/admin/products/${productId}`);
          const data = await response.json();
          if (response.ok) {
            setFormData({
              name: data.name || "",
              description: data.description || "",
              price: Number(data.price) || 0,
              comparePrice: data.comparePrice || 0,
              quantity: Number(data.quantity) || 0,
              sku: data.sku || "",
              categoryId: data.categoryId || undefined,
              status: data.status || "ACTIVE",
              isFeatured: data.isFeatured || false,
              allowCustomPrint: data.allowCustomPrint || false,
              printPrice: data.printPrice || 0,
              images: data.images || [],
              deliveryTime: data.deliveryTime || "",
            });
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
      setLoading(false);
    };

    fetchCategories();
    fetchProduct();
  }, [productId, initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.sku) newErrors.sku = "SKU is required";
    if (isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number";
    if (isNaN(formData.quantity) || formData.quantity < 0)
      newErrors.quantity = "Quantity must be a non-negative number";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    return newErrors;
  };

  const uploadImagesToBlob = async (
    files: File[]
  ): Promise<{ url: string; altText: string }[]> => {
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Upload failed: ${errorData.message || "Unknown error"}`
          );
        }

        const { url } = await response.json();
        return { url, altText: file.name };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      return uploadedImages;
    } catch (error: any) {
      console.error("Error uploading images to Blob:", error);
      toast.error(`Failed to upload images: ${error.message}`);
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const imageFiles = formData.images
      .filter((img) => img.file)
      .map((img) => img.file!);
    let uploadedImages = formData.images
      .filter((img) => !img.file)
      .map((img) => ({ url: img.url, altText: img.altText }));

    if (imageFiles.length > 0) {
      const newUploadedImages = await uploadImagesToBlob(imageFiles);
      uploadedImages = [...uploadedImages, ...newUploadedImages];
    }

    const formDataToSend = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice,
      quantity: Number(formData.quantity),
      printPrice: formData.printPrice,
      images: uploadedImages,
    };

    const url = productId
      ? `/api/admin/products/${productId}`
      : "/api/admin/products";
    const method = productId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        toast.success(
          `Product ${productId ? "updated" : "created"} successfully!`
        );
        router.push("/admin/products");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to save product");
      }
    } catch (error) {
      toast.error("Error saving product");
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      altText: file.name,
      file,
    }));
    updateFormData("images", [...formData.images, ...newImages]);
  };

  const allCategories = Array.from(
    new Map(
      categories
        .flatMap((category) => [
          { ...category, parentName: undefined },
          ...(category.children?.map((child) => ({
            ...child,
            parentName: category.name || undefined,
          })) || []),
        ])
        .map((item) => [item.id, item])
    ).values()
  ) as {
    id: string;
    name: string;
    slug: string;
    parentName?: string | undefined;
  }[];

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                {productId ? "Edit" : "Create"} Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm md:text-base">
                  Product Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description" className="text-sm md:text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  rows={4}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="sku" className="text-sm md:text-base">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => updateFormData("sku", e.target.value)}
                  required
                  className="w-full"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm">{errors.sku}</p>
                )}
              </div>
              <div>
                <Label htmlFor="images" className="text-sm md:text-base">
                  Product Images
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-500">Uploading...</p>
                )}
                {formData.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={img.url}
                          alt={img.altText || "Product image"}
                          width={100}
                          height={100}
                          className="object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() =>
                            updateFormData(
                              "images",
                              formData.images.filter((_, i) => i !== index)
                            )
                          }
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm md:text-base">
                    Price (NGN)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price === 0 ? "" : formData.price} // Show empty string when 0
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        updateFormData("price", ""); // Allow clearing
                      } else {
                        const parsedValue = Number.parseFloat(value);
                        if (!isNaN(parsedValue) && parsedValue >= 0) {
                          updateFormData("price", parsedValue);
                        }
                      }
                    }}
                    required
                    className="w-full"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price}</p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="comparePrice"
                    className="text-sm md:text-base"
                  >
                    Compare Price (NGN)
                  </Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice || ""}
                    onChange={(e) =>
                      updateFormData(
                        "comparePrice",
                        Number.parseFloat(e.target.value) || undefined
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCustomPrint"
                  checked={formData.allowCustomPrint}
                  onCheckedChange={(checked) =>
                    updateFormData("allowCustomPrint", checked)
                  }
                  className="w-5 h-5"
                />
                <Label
                  htmlFor="allowCustomPrint"
                  className="text-sm md:text-base"
                >
                  Allow Custom Print
                </Label>
              </div>
              {formData.allowCustomPrint && (
                <div>
                  <Label htmlFor="printPrice" className="text-sm md:text-base">
                    Print Price (NGN)
                  </Label>
                  <Input
                    id="printPrice"
                    type="number"
                    step="0.01"
                    value={formData.printPrice || ""}
                    onChange={(e) =>
                      updateFormData(
                        "printPrice",
                        Number.parseFloat(e.target.value) || undefined
                      )
                    }
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Product Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status" className="text-sm md:text-base">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateFormData("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-sm md:text-base">
                  Category
                </Label>
                <Select
                  value={formData.categoryId || ""}
                  onValueChange={(value) => updateFormData("categoryId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.parentName
                          ? `${category.parentName} > ${category.name}`
                          : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-red-500 text-sm">{errors.categoryId}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantity" className="text-sm md:text-base">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    updateFormData(
                      "quantity",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  required
                  className="w-full"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>
              <div>
                <Label htmlFor="deliveryTime" className="text-sm md:text-base">
                  Delivery Time (e.g., 7-10 days)
                </Label>
                <Input
                  id="deliveryTime"
                  value={formData.deliveryTime || ""}
                  onChange={(e) =>
                    updateFormData("deliveryTime", e.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    updateFormData("isFeatured", checked)
                  }
                  className="w-5 h-5"
                />
                <Label htmlFor="isFeatured" className="text-sm md:text-base">
                  Featured Product
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
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
        <Button
          type="submit"
          disabled={loading || uploading}
          className="w-full md:w-auto"
        >
          {loading
            ? "Saving..."
            : productId
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
