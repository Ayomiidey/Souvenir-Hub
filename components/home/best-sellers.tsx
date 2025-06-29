"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: { url: string; altText: string }[];
  category: { name: string };
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number;
  sku: string;
}

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=8");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <p className="text-muted-foreground">
            Our most popular custom souvenirs
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
        <h2 className="text-3xl font-bold">Best Sellers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most popular custom souvenirs, loved by thousands of
          customers worldwide
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/products">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
