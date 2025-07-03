"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart } from "lucide-react";
import type { WishlistItem as WishlistItemType } from "@/store/slices/wishlistSlice";

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (productId: string) => void;
  onMoveToCart: (item: WishlistItemType) => void;
}

export function WishlistItem({
  item,
  onRemove,
  onMoveToCart,
}: WishlistItemProps) {
  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">${item.price.toFixed(2)}</span>
            {!item.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMoveToCart(item)}
              disabled={!item.inStock}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(item.productId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
