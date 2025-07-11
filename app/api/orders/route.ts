// File: /app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path to your prisma client
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orderNumber,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      shippingAddress, // full address object
      items, // array of order items
    } = body;

    // 1. Create shipping address (if provided)
    let shippingAddressId: string | null = null;

    if (shippingAddress) {
      const address = await prisma.address.create({
        data: {
          userId: userId || null,
          type: "SHIPPING",
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          company: shippingAddress.company || null,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || null,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone || null,
        },
      });

      shippingAddressId = address.id;
    }

    // 2. Create the order with nested items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        subtotal: new Decimal(subtotal),
        taxAmount: new Decimal(taxAmount),
        shippingAmount: new Decimal(shippingAmount),
        discountAmount: new Decimal(discountAmount),
        totalAmount: new Decimal(totalAmount),
        shippingAddressId,

        items: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            customPrint: item.customPrint || false,
            printText: item.printText || null,
            unitPrice: new Decimal(item.unitPrice),
            totalPrice: new Decimal(item.totalPrice),
            productName: item.productName,
            productSku: item.productSku,
            productImage: item.productImage || null,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Order creation failed",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
