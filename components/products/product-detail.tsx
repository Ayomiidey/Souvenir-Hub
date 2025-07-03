"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { ProductCard } from "./product-card";
import { toast } from "react-hot-toast";
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null; // Allow null
  shortDescription: string | null; // Allow null
  sku: string;
  price: number | string;
  comparePrice?: number | string | null; // Allow null
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number | string | null; // Allow null
  images: { url: string; altText: string | null }[]; // Allow null altText
  category: { name: string; slug: string };
  priceTiers: Array<{
    minQuantity: number;
    discountType: string;
    discountValue: number | string;
  }>;
}

interface ProductDetailProps {
  product: Product;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relatedProducts: any[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customPrint, setCustomPrint] = useState(false);
  const [printText, setPrintText] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Convert prices to numbers if they're strings, handle null values
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

  const currentPrice = price + (customPrint ? printPrice || 0 : 0);
  // const totalPrice = currentPrice * quantity;

  // Get applicable price tier
  const applicableTier = product.priceTiers
    .filter((tier) => quantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];

  const tierDiscount = applicableTier
    ? applicableTier.discountType === "PERCENTAGE"
      ? (currentPrice *
          (typeof applicableTier.discountValue === "string"
            ? Number.parseFloat(applicableTier.discountValue)
            : applicableTier.discountValue)) /
        100
      : typeof applicableTier.discountValue === "string"
      ? Number.parseFloat(applicableTier.discountValue)
      : applicableTier.discountValue
    : 0;

  const finalPrice = Math.max(currentPrice - tierDiscount, 0);
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
          customPrint,
          printText: customPrint ? printText : undefined,
          printPrice: customPrint ? printPrice : undefined,
          maxQuantity: product.quantity,
          sku: product.sku,
        })
      );
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.log(error);
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
          price: price,
          image: product.images[0]?.url || "/placeholder.svg",
          sku: product.sku,
          inStock: product.quantity > 0,
        })
      );
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.svg"}
              alt={product.images[selectedImage]?.altText || product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md bg-muted border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.altText || product.name}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              {product.category.name}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">
              {product.shortDescription || ""}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">
                ${finalPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  ${comparePrice!.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <Badge variant="destructive">-{discountPercentage}%</Badge>
              )}
            </div>

            {applicableTier && (
              <div className="text-sm text-green-600">
                Bulk discount applied:{" "}
                {applicableTier.discountType === "PERCENTAGE"
                  ? `${
                      typeof applicableTier.discountValue === "string"
                        ? Number.parseFloat(applicableTier.discountValue)
                        : applicableTier.discountValue
                    }%`
                  : `$${
                      typeof applicableTier.discountValue === "string"
                        ? Number.parseFloat(applicableTier.discountValue)
                        : applicableTier.discountValue
                    }`}{" "}
                off
              </div>
            )}

            {customPrint && printPrice && (
              <div className="text-sm text-muted-foreground">
                Includes custom printing (+${printPrice.toFixed(2)})
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : product.quantity <= 5 ? (
              <Badge variant="secondary">Only {product.quantity} left</Badge>
            ) : (
              <Badge variant="secondary">In Stock</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </span>
          </div>

          {/* Custom Print Option */}
          {product.allowCustomPrint && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="customPrint"
                    checked={customPrint}
                    onChange={(e) => setCustomPrint(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="customPrint" className="font-medium">
                    Add Custom Print (+${printPrice?.toFixed(2) || "0.00"})
                  </Label>
                </div>

                {customPrint && (
                  <div className="space-y-2">
                    <Label htmlFor="printText">Custom Text</Label>
                    <Textarea
                      id="printText"
                      placeholder="Enter your custom text..."
                      value={printText}
                      onChange={(e) => setPrintText(e.target.value)}
                      maxLength={100}
                    />
                    <div className="text-xs text-muted-foreground">
                      {printText.length}/100 characters
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label>Quantity:</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
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
                  className="w-20 text-center"
                  min={1}
                  max={product.quantity}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.quantity, quantity + 1))
                  }
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Price Tiers */}
            {product.priceTiers.length > 0 && (
              <div className="text-sm space-y-1">
                <div className="font-medium">Bulk Pricing:</div>
                {product.priceTiers.map((tier, index) => (
                  <div key={index} className="text-muted-foreground">
                    {tier.minQuantity}+ items:{" "}
                    {tier.discountType === "PERCENTAGE"
                      ? `${
                          typeof tier.discountValue === "string"
                            ? Number.parseFloat(tier.discountValue)
                            : tier.discountValue
                        }%`
                      : `$${
                          typeof tier.discountValue === "string"
                            ? Number.parseFloat(tier.discountValue)
                            : tier.discountValue
                        }`}{" "}
                    off
                  </div>
                ))}
              </div>
            )}

            <div className="text-lg font-semibold">
              Total: ${finalTotal.toFixed(2)}
            </div>

            <div className="flex space-x-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={
                  isOutOfStock ||
                  isAddingToCart ||
                  (customPrint && !printText.trim())
                }
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center space-y-2">
              <Truck className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-muted-foreground">
                On orders $50+
              </div>
            </div>
            <div className="text-center space-y-2">
              <Shield className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Quality Guarantee</div>
              <div className="text-xs text-muted-foreground">
                100% satisfaction
              </div>
            </div>
            <div className="text-center space-y-2">
              <RotateCcw className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm font-medium">Easy Returns</div>
              <div className="text-xs text-muted-foreground">30-day policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {product.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p>No description available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Product Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">SKU:</dt>
                      <dd>{product.sku}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd>{product.category.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Custom Print:</dt>
                      <dd>
                        {product.allowCustomPrint
                          ? "Available"
                          : "Not Available"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">
                  Be the first to review this product!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <Separator />
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
