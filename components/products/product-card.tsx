"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | string; // Handle both number and string types
  comparePrice?: number | string;
  images: { url: string; altText: string }[];
  category: { name: string };
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number | string;
  sku: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Convert price to number if it's a string
  const price =
    typeof product.price === "string"
      ? Number.parseFloat(product.price)
      : product.price;
  const comparePrice = product.comparePrice
    ? typeof product.comparePrice === "string"
      ? Number.parseFloat(product.comparePrice)
      : product.comparePrice
    : undefined;
  const printPrice = product.printPrice
    ? typeof product.printPrice === "string"
      ? Number.parseFloat(product.printPrice)
      : product.printPrice
    : undefined;

  const isInWishlist = wishlistItems.some(
    (item) => item.productId === product.id
  );
  const isOutOfStock = product.quantity <= 0;
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice! - price) / comparePrice!) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAddingToCart(true);
    try {
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: price,
          image:
            product.images[0]?.url || "/placeholder.svg?height=300&width=300",
          quantity: 1,
          customPrint: false,
          maxQuantity: product.quantity,
          sku: product.sku,
        })
      );
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.log("Add to Cart error:", error);
    } finally {
      setIsAddingToCart(false);
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
          price: price,
          image:
            product.images[0]?.url || "/placeholder.svg?height=300&width=300",
          sku: product.sku,
          inStock: product.quantity > 0,
        })
      );
      toast.success("Added to wishlist!");
    }
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/products/${product.slug}`;
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={
              product.images[0]?.url || "/placeholder.svg?height=300&width=300"
            }
            alt={product.images[0]?.altText || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
          {product.allowCustomPrint && (
            <Badge variant="outline" className="text-xs bg-white/90">
              Custom Print
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={handleViewProduct}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            className="w-full"
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {product.category.name}
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${comparePrice!.toFixed(2)}
              </span>
            )}
          </div>
          {product.allowCustomPrint && printPrice && (
            <div className="text-xs text-muted-foreground">
              + ${printPrice.toFixed(2)} for custom print
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
