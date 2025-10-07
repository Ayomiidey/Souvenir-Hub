import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import { ContactMessageStatus } from "@prisma/client";

// Validation schema for contact form
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactSchema.parse(body);
    
    // Create the contact message in the database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        status: ContactMessageStatus.NEW, // Use the enum value from schema
      },
    });

    // Prepare email data
    const emailData = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      subject: validatedData.subject,
      message: validatedData.message,
      submittedAt: contactMessage.createdAt,
    };

    // Send email notifications (don't block the response if emails fail)
    try {
      // Send notification to admin
      const adminEmailResult = await sendAdminNotification(emailData);
      if (!adminEmailResult.success) {
        console.error("Failed to send admin notification:", adminEmailResult.error);
      }

      // Send confirmation to customer
      const customerEmailResult = await sendCustomerConfirmation(emailData);
      if (!customerEmailResult.success) {
        console.error("Failed to send customer confirmation:", customerEmailResult.error);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue with success response even if emails fail
    }
    
    return NextResponse.json(
      { 
        message: "Your message has been sent successfully! We'll get back to you soon.",
        id: contactMessage.id 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Contact form submission error:", error);
    
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

    // Check if it's a database error
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { message: "Database error. Please try again later." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

// GET: Fetch all contact messages (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    // Build where clause
    const where: {
      status?: ContactMessageStatus;
      OR?: Array<{
        firstName?: { contains: string; mode: "insensitive" };
        lastName?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        subject?: { contains: string; mode: "insensitive" };
      }>;
    } = {};
    if (status && status !== "all") {
      // Validate that the status is a valid enum value
      if (status === "NEW" || status === "READ" || status === "REPLIED") {
        where.status = status as ContactMessageStatus;
      }
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.contactMessage.count({ where });

    // Fetch messages with pagination
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Failed to fetch contact messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}