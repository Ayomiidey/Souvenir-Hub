"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/redux";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { useAppSelector } from "@/hooks/redux";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string };
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number | null;
  sku: string;
  priceTiers?: Array<{
    minQuantity: number;
    discountType: string;
    discountValue: number;
  }>;
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(
    (item) => item.productId === product.id
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.quantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    setIsLoading(true);
    try {
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image:
            product.images[0]?.url || "/placeholder.svg?height=300&width=300",
          quantity: 1,
          customPrint: false,
          maxQuantity: product.quantity,
          sku: product.sku,
        })
      );
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image:
            product.images[0]?.url || "/placeholder.svg?height=300&width=300",
          sku: product.sku,
          inStock: product.quantity > 0,
        })
      );
      toast.success("Added to wishlist!");
    }
  };

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/products/${product.slug}`}>
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
              <Image
                src={
                  imageError
                    ? "/placeholder.svg?height=300&width=300"
                    : product.images[0]?.url ||
                      "/placeholder.svg?height=300&width=300"
                }
                alt={product.images[0]?.altText || product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
              {product.quantity <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            <CardContent className="flex-1 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between h-full">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {product.category.name}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.quantity > 0
                      ? `${product.quantity} in stock`
                      : "Out of stock"}
                  </p>
                  {product.allowCustomPrint && (
                    <p className="text-xs text-blue-600 mt-1">
                      Custom print available{" "}
                      {product.printPrice &&
                        `(+$${product.printPrice.toFixed(2)})`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={
                      isInWishlist ? "text-red-500 border-red-500" : ""
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isLoading || product.quantity <= 0}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      "Adding..."
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              imageError
                ? "/placeholder.svg?height=300&width=300"
                : product.images[0]?.url ||
                  "/placeholder.svg?height=300&width=300"
            }
            alt={product.images[0]?.altText || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />

          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleWishlistToggle}
                className={`h-8 w-8 ${isInWishlist ? "text-red-500" : ""}`}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || product.quantity <= 0}
                className="w-full h-8 text-xs"
                size="sm"
              >
                {isLoading ? (
                  "Adding..."
                ) : product.quantity <= 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Badges */}
          {product.quantity <= 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {discountPercentage > 0 && product.quantity > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.category.name}
          </Badge>
          <h3 className="font-semibold mb-2 line-clamp-2 text-sm">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              {product.comparePrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.quantity > 0
                ? `${product.quantity} left`
                : "Out of stock"}
            </span>
          </div>
          {/* {product.allowCustomPrint && (
            <p className="text-xs text-blue-600">
              Custom print available{" "}
              {product.printPrice && `(+$${product.printPrice.toFixed(2)})`}
            </p>
          )} */}
        </CardContent>
      </Link>
    </Card>
  );
}
