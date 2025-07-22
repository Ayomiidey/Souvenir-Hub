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
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch("/api/products?featured=true&limit=8");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure products is always an array
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      setError(true);
      setProducts([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <p className="text-muted-foreground">
              Our most popular custom souvenirs
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <div className="container">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <p className="text-muted-foreground">
              Unable to load products at the moment
            </p>
            <Button onClick={fetchBestSellers} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="container">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular custom souvenirs, loved by thousands of
            customers worldwide
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No featured products available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
