"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setWishlistOpen,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { WishlistItem } from "./wishlist-item";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function WishlistSidebar() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.wishlist);

  const handleClose = () => {
    dispatch(setWishlistOpen(false));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMoveToCart = (item: any) => {
    if (!item.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        quantity: 1,
        customPrint: false,
        maxQuantity: 100, // Default max quantity
        sku: item.sku,
      })
    );
    dispatch(removeFromWishlist(item.productId));
    toast.success("Moved to cart!");
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-white dark:bg-slate-900 border-l shadow-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Heart className="h-5 w-5" />
            Wishlist ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
            <Heart className="h-16 w-16 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-muted-foreground">
                Save items you love for later
              </p>
            </div>
            <Button asChild onClick={handleClose} className="mt-4">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="space-y-4 pr-4">
                {items.map((item) => (
                  <WishlistItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onMoveToCart={handleMoveToCart}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t bg-background">
              <Separator />
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    // Move all in-stock items to cart
                    const inStockItems = items.filter((item) => item.inStock);
                    inStockItems.forEach((item) => handleMoveToCart(item));
                  }}
                  disabled={!items.some((item) => item.inStock)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add All to Cart
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full bg-transparent"
                >
                  <Link href="/wishlist" onClick={handleClose}>
                    View Full Wishlist
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
