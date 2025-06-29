"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setCartOpen,
  removeFromCart,
  updateQuantity,
} from "@/store/slices/cartSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./cart-item";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartSidebar() {
  const dispatch = useAppDispatch();
  const { items, isOpen, subtotal, itemCount } = useAppSelector(
    (state) => state.cart
  );

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div className="text-center space-y-2">
              <h3 className="font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add some products to get started
              </p>
            </div>
            <Button asChild onClick={handleClose}>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout" onClick={handleClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/cart" onClick={handleClose}>
                    View Cart
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
