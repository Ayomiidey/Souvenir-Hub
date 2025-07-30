// components/admin/dashboard/top-products.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  totalSold: number;
  revenue: number;
  price: number;
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await fetch("/api/admin/analytics/top-products?limit=5");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error("Invalid data format: expected an array");
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-muted rounded shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded shimmer w-32"></div>
              <div className="h-3 bg-muted rounded shimmer w-24"></div>
            </div>
            <div className="h-4 bg-muted rounded shimmer w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
            {index + 1}
          </div>
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
              <span>{product.totalSold} sold</span>
              <span>•</span>
              <span>${product.revenue.toFixed(2)} revenue</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/admin/products/${product.id}`}>
              <Eye className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No sales data available
        </div>
      )}
    </div>
  );
}
