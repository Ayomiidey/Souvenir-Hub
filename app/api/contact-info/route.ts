import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Validation schema for contact info
const contactInfoSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  businessHours: z.object({
    weekdays: z.string().min(1, "Weekday hours are required"),
    weekends: z.string().min(1, "Weekend hours are required"),
  }),
});

// GET: Fetch contact information
export async function GET() {
  try {
    // Fetch contact info settings from database
    const contactSettings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['contact_phone', 'contact_email', 'contact_address', 'contact_weekdays', 'contact_weekends']
        }
      }
    });

    // Convert array to object for easier access
    const settingsMap = contactSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Return contact info with default values if not set
    const contactInfo = {
      phone: settingsMap['contact_phone'] || '+1 (555) 123-4567',
      email: settingsMap['contact_email'] || 'info@souvenirshop.com',
      address: settingsMap['contact_address'] || '123 Main St, City, State 12345',
      businessHours: {
        weekdays: settingsMap['contact_weekdays'] || 'Mon - Fri: 9AM - 6PM',
        weekends: settingsMap['contact_weekends'] || 'Sat - Sun: 10AM - 4PM',
      },
    };

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Failed to fetch contact information:", error);
    return NextResponse.json(
      { message: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}

// POST/PUT: Update contact information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactInfoSchema.parse(body);

    // Prepare settings to upsert
    const settingsToUpsert = [
      { key: 'contact_phone', value: validatedData.phone },
      { key: 'contact_email', value: validatedData.email },
      { key: 'contact_address', value: validatedData.address },
      { key: 'contact_weekdays', value: validatedData.businessHours.weekdays },
      { key: 'contact_weekends', value: validatedData.businessHours.weekends },
    ];

    // Use transaction to update all settings atomically
    await prisma.$transaction(
      settingsToUpsert.map(setting =>
        prisma.setting.upsert({
          where: { key: setting.key },
          update: { 
            value: setting.value,
            updatedAt: new Date()
          },
          create: {
            key: setting.key,
            value: setting.value,
            type: 'STRING'
          }
        })
      )
    );

    return NextResponse.json(
      { 
        message: "Contact information updated successfully!",
        data: validatedData
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Contact info update error:", error);
    
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
      { message: "Failed to update contact information. Please try again later." },
      { status: 500 }
    );
  }
}