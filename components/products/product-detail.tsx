/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Printer,
  ExternalLink,
  Check,
  Info,
  MessageCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { ProductCard } from "./product-card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string; slug: string };
  priceTiers?: Array<{
    minQuantity: number;
    discountType: string;
    discountValue: number;
  }>;
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isInWishlist = wishlistItems.some(
    (item) => item.productId === product.id
  );
  const isOutOfStock = product.quantity <= 0;
  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;

  // Get applicable price tier
  const applicableTier = product.priceTiers
    ?.filter((tier) => quantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];

  const tierDiscount = applicableTier
    ? applicableTier.discountType === "PERCENTAGE"
      ? (product.price * applicableTier.discountValue) / 100
      : applicableTier.discountValue
    : 0;

  const finalPrice = Math.max(product.price - tierDiscount, 0);
  const finalTotal = finalPrice * quantity;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    setIsAddingToCart(true);
    try {
      dispatch(
        addToCart({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: finalPrice,
          image: product.images[0]?.url || "/placeholder.svg",
          quantity,
          maxQuantity: product.quantity,
          sku: product.sku,
          customPrint: false,
          printText: undefined,
          printPrice: undefined,
        })
      );
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
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
          image: product.images[0]?.url || "/placeholder.svg",
          sku: product.sku,
          inStock: product.quantity > 0,
        })
      );
      toast.success("Added to wishlist!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.name,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsAppOrder = () => {
    const whatsappNumber = "+1234567890"; // Replace with your actual WhatsApp business number
    const message = `Hi! I'm interested in ordering this product:

*${product.name}*
SKU: ${product.sku}
Price: $${finalPrice.toFixed(2)}
Quantity: ${quantity}
Total: $${finalTotal.toFixed(2)}

Product Link: ${window.location.href}

Please let me know about availability and delivery options. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Container with proper max-width and centered content */}
      <div className="max-w-7xl mx-auto mt-7 px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link
            href="/"
            className="hover:text-primary font-semibold transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-primary font-semibold transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-primary font-semibold transition-colors px-2 py-1 rounded-lg bg-white/60 dark:bg-slate-800/60 shadow-sm backdrop-blur-md border border-gray-200 dark:border-gray-800"
            style={{ transition: "all 0.2s" }}
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-md border">
              <Image
                src={
                  product.images[selectedImage]?.url ||
                  "/placeholder.svg?height=500&width=500"
                }
                alt={product.images[selectedImage]?.altText || product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105 rounded-xl"
                priority
              />
              {hasDiscount && (
                <Badge
                  variant="destructive"
                  className="absolute top-3 left-3 text-xs font-bold shadow-lg bg-gradient-to-r from-red-500 to-pink-500/80 backdrop-blur-md border border-red-200"
                >
                  -{discountPercentage}%
                </Badge>
              )}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white shadow-lg border border-gray-200 dark:border-gray-800"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg bg-white border-2 transition-all duration-200",
                      selectedImage === index
                        ? "border-primary shadow-sm scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={image.url || "/placeholder.svg?height=100&width=100"}
                      alt={image.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="text-xs px-3 py-1 rounded-lg bg-white/70 dark:bg-slate-800/70 shadow border border-gray-200 dark:border-gray-800 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  <Link href={`/categories/${product.category.slug}`}>
                    {product.category.name}
                  </Link>
                </Badge>
                <span className="text-xs text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-white dark:to-purple-300">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="text-base text-muted-foreground leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.comparePrice!.toFixed(2)}
                  </span>
                )}
              </div>

              {applicableTier && (
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Bulk discount: Save ${tierDiscount.toFixed(2)} per item
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              ) : product.quantity <= 5 ? (
                <Badge
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-800"
                >
                  Only {product.quantity} left
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800"
                >
                  In Stock ({product.quantity} available)
                </Badge>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Label className="text-sm font-medium">Quantity:</Label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-9 w-9"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            product.quantity,
                            Number.parseInt(e.target.value) || 1
                          )
                        )
                      )
                    }
                    className="w-14 text-center border-0 focus-visible:ring-0 text-sm"
                    min={1}
                    max={product.quantity}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(product.quantity, quantity + 1))
                    }
                    disabled={quantity >= product.quantity}
                    className="h-9 w-9"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Price Tiers */}
              {product.priceTiers && product.priceTiers.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                        Bulk Pricing Available
                      </span>
                    </div>
                    <div className="space-y-1">
                      {product.priceTiers.map((tier, index) => (
                        <div
                          key={index}
                          className="text-xs text-blue-700 dark:text-blue-300"
                        >
                          {tier.minQuantity}+ items:{" "}
                          {tier.discountType === "PERCENTAGE"
                            ? `${tier.discountValue}% off`
                            : `$${tier.discountValue} off each`}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-xl font-bold">
                Total:{" "}
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 h-11 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isInWishlist && "fill-red-500 text-red-500"
                    )}
                  />
                </Button>
              </div>

              {/* WhatsApp Order Button */}
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full h-11 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                disabled={isOutOfStock}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Order via WhatsApp
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-xs font-medium">Free Shipping</div>
                <div className="text-xs text-muted-foreground">
                  On orders $50+
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-xs font-medium">Quality Guarantee</div>
                <div className="text-xs text-muted-foreground">
                  100% satisfaction
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-xs font-medium">Easy Returns</div>
                <div className="text-xs text-muted-foreground">
                  30-day policy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Print Section */}
        {product.allowCustomPrint && (
          <Card className="mb-10 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Printer className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-orange-900 dark:text-orange-100">
                    Custom Printing Available
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 mb-4 text-sm leading-relaxed">
                    Want to personalize this product with your own design, logo,
                    or text? Our professional printing partners can help you
                    create the perfect custom souvenir.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-orange-50 border-orange-300 text-orange-700"
                      asChild
                    >
                      <Link
                        href="/contact?service=printing"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Contact Printing Service
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-orange-50 border-orange-300 text-orange-700"
                      asChild
                    >
                      <Link
                        href="/printing-guide"
                        className="flex items-center gap-2"
                      >
                        <Info className="h-3 w-3" />
                        Printing Guidelines
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Details Tabs */}
        <Card className="mb-10">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-11">
              <TabsTrigger value="description" className="text-sm">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-sm">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <CardContent className="p-6">
                <div className="prose max-w-none dark:prose-invert prose-sm">
                  {product.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      No detailed description available.
                    </p>
                  )}
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-base mb-3">
                      Product Details
                    </h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <dt className="text-muted-foreground font-medium text-sm">
                          SKU:
                        </dt>
                        <dd className="font-mono text-sm">{product.sku}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <dt className="text-muted-foreground font-medium text-sm">
                          Category:
                        </dt>
                        <dd className="text-sm">{product.category.name}</dd>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <dt className="text-muted-foreground font-medium text-sm">
                          Stock:
                        </dt>
                        <dd className="text-sm">{product.quantity} units</dd>
                      </div>
                      <div className="flex justify-between py-2">
                        <dt className="text-muted-foreground font-medium text-sm">
                          Custom Print:
                        </dt>
                        <dd className="text-sm">
                          {product.allowCustomPrint
                            ? "Available"
                            : "Not Available"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <Star className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Be the first to review this product!
                  </p>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <Separator className="mb-8" />
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                You Might Also Like
              </h2>
              <p className="text-muted-foreground">
                Discover more products from our collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  viewMode="grid"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
