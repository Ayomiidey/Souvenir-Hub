"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux";

export function CheckoutSummary() {
  const { items, subtotal } = useAppSelector((state) => state.cart);

  const shipping = subtotal >= 200000 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                  {item.customPrint && " • Custom Print"}
                </div>
              </div>
              <div className="text-sm font-medium">
                ₦{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₦{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>₦{tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>
        </div>

        {subtotal >= 200000 && (
          <div className="text-xs text-green-600 text-center">
            🎉 You qualify for free shipping!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
