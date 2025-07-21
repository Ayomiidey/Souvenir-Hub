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

  const handleClose = () => dispatch(setCartOpen(false));
  const handleRemoveItem = (id: string) => dispatch(removeFromCart(id));
  const handleUpdateQuantity = (id: string, quantity: number) =>
    dispatch(updateQuantity({ id, quantity }));

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-white dark:bg-slate-950 border-l border-border shadow-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center px-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Your cart is empty
              </h3>
              <p className="text-sm text-muted-foreground">
                Add some items to get started!
              </p>
            </div>
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-6 pr-2">
              <div className="space-y-6">
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

            <div className="space-y-6 pt-4 border-t mt-4 bg-background px-1">
              <div className="space-y-2 text-sm text-foreground">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full h-11 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base"
                >
                  <Link href="/checkout" onClick={handleClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-11 rounded-full border-gray-300 dark:border-gray-700 text-base"
                >
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
