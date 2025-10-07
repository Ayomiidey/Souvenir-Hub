import { NextResponse } from "next/server";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";

// Test endpoint for email functionality
export async function POST() {
  try {
    const testEmailData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "+1234567890",
      subject: "Test Email",
      message: "This is a test message to verify email functionality is working correctly.",
      submittedAt: new Date(),
    };

    // Test admin notification
    const adminResult = await sendAdminNotification(testEmailData);
    
    // Test customer confirmation
    const customerResult = await sendCustomerConfirmation(testEmailData);

    return NextResponse.json({
      success: true,
      adminEmail: adminResult,
      customerEmail: customerResult,
    });

  } catch (error) {
    console.error("Test email failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}