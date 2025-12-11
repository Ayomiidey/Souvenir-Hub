import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const itemsHtml = order.items
      .map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i: any, idx: number) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${idx + 1}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${i.productName}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${i.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₦${i.unitPrice}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₦${i.quantity * i.unitPrice}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
        
        <h2 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
          🛍️ New Bank Transfer Order Notification
        </h2>
        
        <div style="background: #f39c12; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>⚠️ ATTENTION:</strong> This order requires payment verification before processing.
        </div>

        <h3 style="color: #2c3e50; margin-top: 30px;">📋 ORDER DETAILS</h3>
        <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Order Status:</strong> <span style="color: #f39c12; font-weight: bold;">Pending Payment Verification</span></p>
        </div>

        <h3 style="color: #2c3e50;">👤 CUSTOMER INFORMATION</h3>
        <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p><strong>Customer Name:</strong> ${order.customerInfo.name}</p>
          <p><strong>Email Address:</strong> <a href="mailto:${order.customerInfo.email}" style="color: #3498db;">${order.customerInfo.email}</a></p>
          <p><strong>Phone Number:</strong> ${order.customerInfo.phone || "Not provided"}</p>
        </div>

        <h3 style="color: #2c3e50;">🚚 DELIVERY ADDRESS</h3>
        <div style="background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Recipient:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
          <p style="margin: 5px 0;"><strong>Address:</strong></p>
          <div style="margin-left: 20px;">
            ${order.shippingAddress.addressLine1}<br/>
            ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}<br/>` : ""}
            ${order.shippingAddress.city}, ${order.shippingAddress.state} <br/>
            ${order.shippingAddress.country}
          </div>
        </div>

        <h3 style="color: #2c3e50;">📦 ITEMS ORDERED</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;" border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr style="background-color: #34495e; color: white;">
              <th style="padding: 10px; text-align: left;">#</th>
              <th style="padding: 10px; text-align: left;">Product Name</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Unit Price</th>
              <th style="padding: 10px; text-align: right;">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="color: #2c3e50;">💰 PAYMENT BREAKDOWN</h3>
        <div style="background: #d5f4e6; padding: 15px; border-radius: 5px; border-left: 5px solid #27ae60;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="padding: 5px 0; border: none;"><strong>Subtotal:</strong></td>
              <td style="padding: 5px 0; text-align: right; border: none;">₦${order.totals.subtotal}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border: none;"><strong>Shipping Fee:</strong></td>
              <td style="padding: 5px 0; text-align: right; border: none;">₦${order.totals.shipping}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; border: none;"><strong>Tax:</strong></td>
              <td style="padding: 5px 0; text-align: right; border: none;">₦${order.totals.tax}</td>
            </tr>
            <tr style="border-top: 2px solid #27ae60;">
              <td style="padding: 10px 0 5px 0; border: none; font-size: 18px;"><strong>TOTAL AMOUNT:</strong></td>
              <td style="padding: 10px 0 5px 0; text-align: right; border: none; font-size: 18px; color: #27ae60;"><strong>₦${order.totals.total}</strong></td>
            </tr>
          </table>
        </div>

        ${
          order.customerNotes
            ? `
            <h3 style="color: #2c3e50; margin-top: 30px;">💬 CUSTOMER MESSAGE</h3>
            <div style="background: #fdf2e9; padding: 15px; border-radius: 5px; border-left: 5px solid #e67e22; margin-bottom: 20px;">
              <p style="margin: 0; font-style: italic; color: #d35400;">
                "${order.customerNotes}"
              </p>
            </div>
            `
            : ""
        }

        <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin-top: 30px;">
          <h3 style="color: #2c3e50; margin-top: 0;">🔔 NEXT STEPS REQUIRED:</h3>
          <ol style="color: #2c3e50; margin: 10px 0;">
            <li><strong>Verify Payment:</strong> Check if customer has made the bank transfer</li>
            <li><strong>Confirm Stock:</strong> Ensure all ordered items are available</li>
            <li><strong>Process Order:</strong> Update order status once payment is confirmed</li>
            <li><strong>Notify Customer:</strong> Send order confirmation to customer</li>
            <li><strong>Prepare Shipment:</strong> Package items for delivery</li>
          </ol>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #bdc3c7; text-align: center; color: #7f8c8d;">
          <p style="margin: 0; font-size: 14px;">
            This notification was automatically generated by Classy Souvenir Order Management System
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">
            Generated on ${new Date().toLocaleString("en-US")}
          </p>
        </div>

      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Classy Souvenir <onboarding@resend.dev>", // or your verified domain
      to: process.env.ADMIN_EMAIL!,
      subject: "New Bank Transfer Order",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
