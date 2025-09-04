import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, CreditCard } from "lucide-react";
import Link from "next/link";

interface OrderConfirmationProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationProps) {
  // Await params in Next.js 15
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: { take: 1 } },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      notFound();
    }

    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We&apos;ll send you a confirmation email
            shortly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">
                  ₦{Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">
                  {order.paymentMethod?.replace("_", " ")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="w-full justify-center py-2">
                {order.paymentStatus.replace("_", " ")}
              </Badge>

              {order.paymentMethod === "BANK_TRANSFER" && (
                <div className="p-4 bg-muted rounded-lg text-sm">
                  <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                  <div className="space-y-1">
                    <p>
                      <strong>Bank:</strong> Example Bank
                    </p>
                    <p>
                      <strong>Account:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Reference:</strong> #{order.orderNumber}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <div>
                    <h4 className="font-medium">{item.productName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₦
                      {Number(item.unitPrice).toFixed(2)}
                    </p>
                    {item.customPrint && item.printText && (
                      <p className="text-sm text-muted-foreground">
                        Custom: &quot;{item.printText}&quot;
                      </p>
                    )}
                  </div>
                  <span className="font-medium">
                    ₦{Number(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 space-y-4">
          <p className="text-muted-foreground">
            We&apos;ll send you tracking information once your order ships.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading order confirmation:", error);
    notFound();
  }
}
