import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: (await params).id },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
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
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();

    const order = await prisma.order.update({
      where: { id: (await params).id },
      data: {
        status: body.status || "CONFIRMED",
        paymentStatus: body.paymentStatus || "PAID", // Default to PAID for WhatsApp
        trackingNumber: body.trackingNumber,
        adminNotes: body.adminNotes,
        shippedAt: body.status === "SHIPPED" ? new Date() : undefined,
        deliveredAt: body.status === "DELIVERED" ? new Date() : undefined,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
