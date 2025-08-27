"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await fetch("/api/products?sortBy=newest&limit=4");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <p className="text-muted-foreground">Fresh designs just added</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg shimmer"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded shimmer"></div>
                <div className="h-4 bg-muted rounded w-2/3 shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">New Arrivals</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Check out our latest additions to the collection
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Only show 2 on mobile, 4 on desktop */}
        {products.slice(0, 4).map((product, idx) => (
          <div key={product.id} className={idx > 1 ? "hidden lg:block" : ""}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/products?sortBy=newest">
            View All New Arrivals
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
