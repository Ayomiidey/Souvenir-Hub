/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
// Types for state/location/printer
type State = { id: string; name: string };
type Location = { id: string; name: string; stateId: string; state: State };
type Printer = {
  id: string;
  name: string;
  stateId: string;
  locationId: string;
  state: State;
  location: Location;
};
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
import { Product } from "@/types/product";

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

  // Print service workflow state
  // Print service workflow state
  const [wantsPrint, setWantsPrint] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingPrinters, setLoadingPrinters] = useState(false);
  const [hasViewedPrinters, setHasViewedPrinters] = useState(false);
  // Fetch states when print is enabled
  useEffect(() => {
    if (wantsPrint) {
      setLoadingStates(true);
      fetch("/api/states")
        .then((res) => res.json())
        .then((data) => setStates(data))
        .catch(() => setStates([]))
        .finally(() => setLoadingStates(false));
    } else {
      setStates([]);
      setSelectedState("");
      setLocations([]);
      setSelectedLocation("");
      setPrinters([]);
      setHasViewedPrinters(false);
    }
  }, [wantsPrint]);

  // Fetch locations when state is selected
  useEffect(() => {
    if (wantsPrint && selectedState) {
      setLoadingLocations(true);
      fetch(`/api/locations`)
        .then((res) => res.json())
        .then((data) =>
          setLocations(
            data.filter((loc: Location) => loc.stateId === selectedState)
          )
        )
        .catch(() => setLocations([]))
        .finally(() => setLoadingLocations(false));
    } else {
      setLocations([]);
      setSelectedLocation("");
    }
  }, [wantsPrint, selectedState]);

  // Fetch printers when state/location is selected and user clicks button
  const handleViewPrinters = () => {
    if (!selectedState || !selectedLocation) return;
    setLoadingPrinters(true);
    setHasViewedPrinters(true);
    fetch(
      `/api/printers?stateId=${selectedState}&locationId=${selectedLocation}`
    )
      .then((res) => res.json())
      .then((data) => setPrinters(data))
      .catch(() => setPrinters([]))
      .finally(() => setLoadingPrinters(false));
  };

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
    const whatsappNumber = "+2348068005956"; // Replace with your actual WhatsApp business number
    const message = `Hi! I'm interested in ordering this product:

*${product.name}*
SKU: ${product.sku}
Price: ₦${finalPrice.toFixed(2)}
Quantity: ${quantity}
Total: ₦${finalTotal.toFixed(2)}

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
      <div className="max-w-7xl mx-auto mt-7 px-4 sm:px-6 lg:px-8 py-6 pt-20">
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
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 text-foreground dark:text-white">
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
                  ₦{finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₦{product.comparePrice!.toFixed(2)}
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
              {product.deliveryTime && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  {product.deliveryTime}
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
                            : `₦${tier.discountValue} off each`}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-xl font-bold">
                Total:{" "}
                <span className="text-primary">₦{finalTotal.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1 h-10 rounded-sm text-lg font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  className="flex-1 h-10 rounded-sm text-lg font-bold cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-2"
                  onClick={handleWhatsAppOrder}
                  disabled={isOutOfStock}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Order on WhatsApp</span>
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full h-10 rounded-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isInWishlist && "fill-red-500 text-red-500"
                  )}
                />
                <span>
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </span>
              </Button>
            </div>
            {/* Print Service Workflow */}
            <div className="pt-4 border-t">
              {product.allowCustomPrint && (
                <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 mb-4">
                  <CardContent className="p-4">
                    <div className="mb-2 font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                      <Printer className="h-5 w-5 text-orange-600" />
                      Print Service
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <Label className="text-sm">
                          Do you want to print on this product?
                        </Label>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="wantsPrint"
                              checked={wantsPrint === true}
                              onChange={() => setWantsPrint(true)}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="wantsPrint"
                              checked={wantsPrint === false}
                              onChange={() => setWantsPrint(false)}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                      {wantsPrint && (
                        <div className="flex flex-col gap-3 mt-2">
                          <h1>
                            NOTE: We are not affiliated with any of the printing
                            service.
                          </h1>
                          <div>
                            <Label className="text-sm mb-1">Select State</Label>
                            <Select
                              value={selectedState}
                              onValueChange={(val) => {
                                setSelectedState(val);
                                setSelectedLocation("");
                                setPrinters([]);
                              }}
                              disabled={loadingStates || states.length === 0}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    loadingStates
                                      ? "Loading states..."
                                      : "Choose a state"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem key={state.id} value={state.id}>
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedState && (
                            <div>
                              <Label className="text-sm mb-1">
                                Select Location
                              </Label>
                              <Select
                                value={selectedLocation}
                                onValueChange={(val) => {
                                  setSelectedLocation(val);
                                  setPrinters([]);
                                }}
                                disabled={
                                  loadingLocations || locations.length === 0
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      loadingLocations
                                        ? "Loading locations..."
                                        : "Choose a location"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {locations.map((loc) => (
                                    <SelectItem key={loc.id} value={loc.id}>
                                      {loc.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {selectedState && selectedLocation && (
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                type="button"
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                onClick={handleViewPrinters}
                                disabled={loadingPrinters}
                              >
                                {loadingPrinters
                                  ? "Loading printers..."
                                  : "View Available Printers"}
                              </Button>
                            </div>
                          )}
                          {/* Only show printers or no-printers message after user clicks view */}
                          {hasViewedPrinters && (
                            <>
                              {printers.length > 0 ? (
                                <div className="mt-3">
                                  <Label className="text-sm mb-1">
                                    Available Printers:
                                  </Label>
                                  <ul className="list-disc pl-5 text-sm">
                                    {printers.map((printer) => (
                                      <li key={printer.id} className="mb-1">
                                        <Link
                                          href={`/printers/${printer.id}`}
                                          className="font-semibold text-orange-800 dark:text-orange-200 hover:underline hover:text-orange-600"
                                        >
                                          {printer.name}
                                        </Link>
                                        {printer.location?.name ? (
                                          <span className="ml-2 text-muted-foreground">
                                            ({printer.location.name})
                                          </span>
                                        ) : null}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                !loadingPrinters && (
                                  <div className="text-xs text-muted-foreground mt-2">
                                    No printers found for this location.
                                  </div>
                                )
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

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
