/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import Image from "next/image";
import { CategoryWithChildren } from "@/types/category";

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
  isLowBudget: boolean;
  allowCustomPrint: boolean;
  images: { url: string; altText: string; file?: File }[];
  deliveryTime?: string;
  isActive: boolean;
  priceTiers?: Array<{
    minQuantity: number;
    discountType: string;
    discountValue: number;
  }>;
}

interface ProductFormProps {
  productId?: string;
  initialData?: ProductFormData;
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
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
      isLowBudget: false,
      allowCustomPrint: false,
      images: [],
      deliveryTime: "",
      isActive: true,
      priceTiers: [], // Add default empty array
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        const data = await response.json();
        console.log("Raw categories data:", data.categories);
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
              isLowBudget: data.isLowBudget || false,
              allowCustomPrint: data.allowCustomPrint || false,
              images: data.images || [],
              deliveryTime: data.deliveryTime || "",
              isActive: data.isActive || true,
              priceTiers: data.priceTiers || [],
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

    // Validate price tiers
    if (formData.priceTiers) {
      formData.priceTiers.forEach((tier, idx) => {
        if (tier.minQuantity < 1) {
          newErrors[`priceTiers[${idx}].minQuantity`] =
            "Minimum quantity must be at least 1";
        }
        if (tier.discountValue < 0) {
          newErrors[`priceTiers[${idx}].discountValue`] =
            "Discount value cannot be negative";
        }
      });
    }

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

        const response = await fetch("/api/admin/upload", {
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
      setFormData((prev) => ({ ...prev, images: uploadedImages }));
    }

    const formDataToSend = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice,
      quantity: Number(formData.quantity),
      images: uploadedImages,
      isActive: true,
      priceTiers: formData.priceTiers, // Ensure priceTiers is included
    };
    console.log("Sending formData:", formDataToSend);

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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      altText: file.name,
      file,
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
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
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => updateFormData("description", value)}
                  placeholder="Enter product description with rich text formatting..."
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
              <CardTitle className="text-lg md:text-xl">
                Price Tiers (Bulk Discount)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.priceTiers || []).map((tier, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-2 items-end border p-3 rounded-md bg-gray-50 dark:bg-slate-900/30"
                >
                  <div className="flex-1">
                    <Label>Min Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={tier.minQuantity === 0 ? "" : tier.minQuantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        const newTiers = [...(formData.priceTiers || [])];
                        newTiers[idx].minQuantity =
                          value === "" ? 0 : parseInt(value) || 0;
                        updateFormData("priceTiers", newTiers);
                      }}
                      className="w-full"
                    />
                    {errors[`priceTiers[${idx}].minQuantity`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`priceTiers[${idx}].minQuantity`]}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label>Discount Type</Label>
                    <Select
                      value={tier.discountType}
                      onValueChange={(val) => {
                        const newTiers = [...(formData.priceTiers || [])];
                        newTiers[idx].discountType = val;
                        updateFormData("priceTiers", newTiers);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">
                          Percentage (%)
                        </SelectItem>
                        <SelectItem value="FIXED_AMOUNT">
                          Fixed Amount (NGN)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Discount Value</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={tier.discountValue === 0 ? "" : tier.discountValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        const newTiers = [...(formData.priceTiers || [])];
                        newTiers[idx].discountValue =
                          value === "" ? 0 : parseFloat(value) || 0;
                        updateFormData("priceTiers", newTiers);
                      }}
                      className="w-full"
                    />
                    {errors[`priceTiers[${idx}].discountValue`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`priceTiers[${idx}].discountValue`]}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2 sm:mt-0"
                    onClick={() => {
                      const newTiers = [...(formData.priceTiers || [])];
                      newTiers.splice(idx, 1);
                      updateFormData("priceTiers", newTiers);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newTiers = [...(formData.priceTiers || [])];
                  newTiers.push({
                    minQuantity: 1,
                    discountType: "PERCENTAGE",
                    discountValue: 0,
                  });
                  updateFormData("priceTiers", newTiers);
                }}
              >
                Add Price Tier
              </Button>
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
                    value={formData.price === 0 ? "" : formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        updateFormData("price", "");
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isLowBudget"
                  checked={formData.isLowBudget}
                  onCheckedChange={(checked) =>
                    updateFormData("isLowBudget", checked)
                  }
                  className="w-5 h-5"
                />
                <Label htmlFor="isLowBudget" className="text-sm md:text-base">
                  Low Budget
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
