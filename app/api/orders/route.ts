/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + item.unitPrice * item.quantity,
      0
    );
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        customerName: body.customerInfo.name,
        customerEmail: body.customerInfo.email,
        customerPhone: body.customerInfo.phone || null,
        subtotal,
        taxAmount: tax,
        shippingAmount: shipping,
        totalAmount: total,
        paymentMethod: body.paymentMethod,
        customerNotes: body.customerNotes || null,
        status: "PENDING",
        paymentStatus: "AWAITING_PAYMENT",
        shippingAddress: {
          create: {
            userId: session?.user?.id || null,
            type: "SHIPPING",
            firstName: body.shippingAddress.firstName,
            lastName: body.shippingAddress.lastName,
            company: body.shippingAddress.company || null,
            addressLine1: body.shippingAddress.addressLine1,
            addressLine2: body.shippingAddress.addressLine2 || null,
            city: body.shippingAddress.city,
            state: body.shippingAddress.state,
            postalCode: body.shippingAddress.postalCode,
            country: body.shippingAddress.country,
          },
        },
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            customPrint: item.customPrint || false,
            printText: item.printText || null,
            // We'll need to fetch product details for snapshot
            productName: "", // Will be updated below
            productSku: "", // Will be updated below
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, images: { take: 1 } },
            },
          },
        },
        shippingAddress: true,
      },
    });

    // Update order items with product snapshot data
    for (const item of order.items) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          productName: item.product.name,
          productSku: item.product.sku,
          productImage: item.product.images[0]?.url || null,
        },
      });

      // Update product quantity
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
