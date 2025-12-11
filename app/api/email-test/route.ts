import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/email";

export async function GET() {
  try {
    // Check if environment variables are configured
    const requiredEnvVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing environment variables",
          missingVariables: missingVars,
          setup: "Please check MAIL_SETUP.md for configuration instructions"
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Email configuration looks good!",
      config: {
        fromEmail: process.env.RESEND_FROM_EMAIL,
        adminEmail: process.env.ADMIN_EMAIL,
        apiKeyConfigured: !!process.env.RESEND_API_KEY
      }
    });

  } catch (error) {
    console.error("Email config test error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error checking email configuration",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json();

    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Send a test email
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'test@resend.dev',
      to: testEmail,
      subject: '🧪 Email Configuration Test - Classy Souvenir',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="margin: 0;">🎉 Email Test Successful!</h1>
            <p style="margin: 10px 0 0 0;">Your Classy Souvenir email configuration is working perfectly!</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">✅ What This Means:</h2>
            <ul style="color: #666; line-height: 1.6;">
              <li>Contact form emails will be sent successfully</li>
              <li>Admin notifications are configured correctly</li>
              <li>Email replies from admin panel will work</li>
              <li>Customer confirmations will be delivered</li>
            </ul>
            
            <p style="color: #666; margin-top: 25px;">
              <strong>Configuration Details:</strong><br>
              From: ${process.env.RESEND_FROM_EMAIL}<br>
              Admin: ${process.env.ADMIN_EMAIL}<br>
              Test Date: ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
            <p>This is an automated test email from your Classy Souvenir application.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      status: "success",
      message: "Test email sent successfully!",
      emailId: result.data?.id,
      sentTo: testEmail
    });

  } catch (error) {
    console.error("Test email error:", error);
    
    let errorMessage = "Failed to send test email";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "Invalid or missing API key. Please check your RESEND_API_KEY.";
        statusCode = 401;
      } else if (error.message.includes('domain')) {
        errorMessage = "Domain not verified. Please verify your domain in Resend or use a verified email.";
        statusCode = 403;
      } else if (error.message.includes('rate limit')) {
        errorMessage = "Rate limit exceeded. Please try again later.";
        statusCode = 429;
      }
    }

    return NextResponse.json(
      {
        status: "error",
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: statusCode }
    );
  }
}