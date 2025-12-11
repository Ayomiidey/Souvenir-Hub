import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/email";

// Validation schema for reply email
const replyEmailSchema = z.object({
  to: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  originalMessageId: z.string().min(1, "Original message ID is required"),
});

// Send reply email from admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = replyEmailSchema.parse(body);
    
    // Create professional email template
    const createReplyTemplate = (message: string, originalSubject: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reply from Classy Souvenir</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .message { background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
    .brand { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .tag { background: #667eea; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">🎁 Classy Souvenir</div>
      <p>Thank you for contacting us. Here's our response:</p>
    </div>
    
    <div class="content">
      <div class="message">
        ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
      
      <div class="footer">
        <p><strong>Best regards,</strong><br>The Classy Souvenir Team</p>
        <p>
          📧 <a href="mailto:${process.env.ADMIN_EMAIL || 'info@classysouvenir.com'}">${process.env.ADMIN_EMAIL || 'info@classysouvenir.com'}</a> | 
          📞 +1 (555) 123-4567
        </p>
        <p style="font-size: 12px; color: #999;">
          This email is in response to your inquiry: "${originalSubject}"
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Send the reply email
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@souvenirshop.com',
      to: validatedData.to,
      subject: validatedData.subject,
      html: createReplyTemplate(validatedData.message, validatedData.subject),
      replyTo: process.env.ADMIN_EMAIL || 'admin@souvenirshop.com',
    });

    return NextResponse.json(
      { 
        message: "Reply sent successfully!",
        emailId: result.data?.id 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Reply email error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Validation error",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Check if it's a Resend API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { message: "Email service configuration error. Please check your API keys." },
          { status: 503 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { message: "Email rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { message: "Failed to send reply. Please try again later." },
      { status: 500 }
    );
  }
}