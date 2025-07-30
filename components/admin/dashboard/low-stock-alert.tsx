"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Edit } from "lucide-react";

interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  lowStockThreshold: number;
  sku: string;
}

export function LowStockAlert() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch("/api/admin/products/low-stock?limit=5");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-3 border rounded-lg"
          >
            <div className="h-12 w-12 bg-muted rounded shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded shimmer w-32"></div>
              <div className="h-3 bg-muted rounded shimmer w-24"></div>
            </div>
            <div className="h-6 bg-muted rounded shimmer w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    } else if (quantity <= threshold) {
      return { label: "Low Stock", color: "bg-orange-100 text-orange-800" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const status = getStockStatus(
          product.quantity,
          product.lowStockThreshold
        );
        return (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span>{product.quantity} units left</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={status.color}>{status.label}</Badge>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Edit className="h-3 w-3 mr-1" />
                  Update
                </Link>
              </Button>
            </div>
          </div>
        );
      })}

      {products.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          All products are well stocked!
        </div>
      )}

      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/admin/products?filter=low-stock">
            View All Low Stock
          </Link>
        </Button>
      </div>
    </div>
  );
}
