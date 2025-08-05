"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";

export default function EditProductPage() {
  const params = useParams();
  const { id } = params as { id: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInitialData({
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
        } else {
          console.error("Failed to fetch product:", await response.json());
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  return <ProductForm productId={id} initialData={initialData} />;
}
