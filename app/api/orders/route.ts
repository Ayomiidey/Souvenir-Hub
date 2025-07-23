/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  customPrint?: boolean;
  printText?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  customerNotes?: string;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

async function sendOrderEmail(orderData: any, orderNumber: string) {
  try {
    // Create email content
    const emailContent = {
      to: "your-business-email@example.com", // Replace with your business email
      subject: `New Order Received - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            🛍️ New Order Received
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4CAF50; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">👤 Customer Information</h3>
            <p><strong>Name:</strong> ${orderData.customerInfo.name}</p>
            <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
            <p><strong>Phone:</strong> ${
              orderData.customerInfo.phone || "Not provided"
            }</p>
          </div>

          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📍 Shipping Address</h3>
            <p>
              ${orderData.shippingAddress.firstName} ${
        orderData.shippingAddress.lastName
      }<br>
              ${
                orderData.shippingAddress.company
                  ? `${orderData.shippingAddress.company}<br>`
                  : ""
              }
              ${orderData.shippingAddress.addressLine1}<br>
              ${
                orderData.shippingAddress.addressLine2
                  ? `${orderData.shippingAddress.addressLine2}<br>`
                  : ""
              }
              ${orderData.shippingAddress.city}, ${
        orderData.shippingAddress.state
      } ${orderData.shippingAddress.postalCode}<br>
              ${orderData.shippingAddress.country}
            </p>
          </div>

          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📦 Order Items</h3>
            ${orderData.items
              .map(
                (item: any, index: number) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0; ${
                index === orderData.items.length - 1
                  ? "border-bottom: none;"
                  : ""
              }">
                <p><strong>${item.productName || "Product"}</strong></p>
                <p>SKU: ${item.productSku || "N/A"}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Unit Price: $${item.unitPrice.toFixed(2)}</p>
                ${
                  item.customPrint
                    ? `<p>Custom Print: "${item.printText}"</p>`
                    : ""
                }
                <p><strong>Subtotal: $${(
                  item.unitPrice * item.quantity
                ).toFixed(2)}</strong></p>
              </div>
            `
              )
              .join("")}
          </div>

          <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: white;">💰 Order Summary</h3>
            <p>Subtotal: $${orderData.totals.subtotal.toFixed(2)}</p>
            <p>Shipping: ${
              orderData.totals.shipping === 0
                ? "FREE"
                : `$${orderData.totals.shipping.toFixed(2)}`
            }</p>
            <p>Tax: $${orderData.totals.tax.toFixed(2)}</p>
            <p style="font-size: 18px; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px; margin-top: 10px;">
              Total: $${orderData.totals.total.toFixed(2)}
            </p>
          </div>

          ${
            orderData.customerNotes
              ? `
            <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📝 Customer Notes</h3>
              <p>${orderData.customerNotes}</p>
            </div>
          `
              : ""
          }

          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f0f0f0; border-radius: 8px;">
            <p style="margin: 0; color: #666;">
              Please process this order and contact the customer for payment confirmation if needed.
            </p>
          </div>
        </div>
      `,
    };

    // Send email using your preferred email service
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailContent),
    });

    return response.ok;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body: OrderRequest = await request.json();

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // First, create the shipping address
    const shippingAddress = await prisma.address.create({
      data: {
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
    });

    // Create the order with the shipping address ID
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        customerName: body.customerInfo.name,
        customerEmail: body.customerInfo.email,
        customerPhone: body.customerInfo.phone || null,
        subtotal: body.totals.subtotal,
        taxAmount: body.totals.tax,
        shippingAmount: body.totals.shipping,
        totalAmount: body.totals.total,
        paymentMethod: body.paymentMethod,
        customerNotes: body.customerNotes || null,
        status: "PENDING",
        paymentStatus: "AWAITING_PAYMENT",
        shippingAddressId: shippingAddress.id,
      },
    });

    // Create order items and get product details
    const orderItems = [];
    for (const item of body.items) {
      // Get product details for snapshot
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, sku: true, images: { take: 1 } },
      });

      // Create order item
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          customPrint: item.customPrint || false,
          printText: item.printText || null,
          productName: product?.name || "",
          productSku: product?.sku || "",
          productImage: product?.images[0]?.url || null,
        },
      });

      orderItems.push({
        ...orderItem,
        productName: product?.name || "",
        productSku: product?.sku || "",
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

    // Get the complete order with all relations
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
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

    // Send email notification
    const emailData = {
      ...body,
      items: orderItems,
    };

    await sendOrderEmail(emailData, orderNumber);

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
