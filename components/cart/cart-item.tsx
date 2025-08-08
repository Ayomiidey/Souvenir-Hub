"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "@/store/slices/cartSlice";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const itemTotal =
    (item.price + (item.customPrint ? item.printPrice || 0 : 0)) *
    item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

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

        {item.customPrint && (
          <div className="text-xs text-muted-foreground">
            Custom Print {item.printText && `"${item.printText}"`}
            {item.printPrice && ` (+₦${item.printPrice.toFixed(2)})`}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(Number.parseInt(e.target.value) || 1)
              }
              className="w-16 h-8 text-center"
              min={1}
              max={item.maxQuantity}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            $
            {(
              item.price + (item.customPrint ? item.printPrice || 0 : 0)
            ).toFixed(2)}{" "}
            each
          </span>
          <span className="font-medium">${itemTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
