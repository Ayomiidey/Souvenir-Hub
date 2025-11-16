// app/api/footer/route.ts
// Handles GET and PUT requests for footer data, including validation for category IDs

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma"; // Adjust path to your Prisma client

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Zod schema for validating footer data
const footerSchema = z.object({
  companyTitle: z.string().min(1, "Company title is required"),
  companyDescription: z.string().min(1, "Company description is required"),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(["facebook", "twitter", "instagram"], {
          message: "Invalid social platform",
        }),
        href: z.string().url("Invalid URL"),
      })
    )
    .min(1, "At least one social link is required"),
  customerServiceTitle: z.string().min(1, "Customer service title is required"),
  customerServiceLinks: z
    .array(
      z.object({
        text: z.string().min(1, "Link text is required"),
        href: z.string().min(1, "Link href is required"),
      })
    )
    .min(1, "At least one customer service link is required"),
  contactTitle: z.string().min(1, "Contact title is required"),
  contacts: z
    .array(
      z.object({
        icon: z.enum(["mail", "phone", "map"], {
          message: "Invalid contact icon",
        }),
        text: z.string().min(1, "Contact text is required"),
        href: z.string().optional(),
      })
    )
    .length(3, "Exactly three contacts are required (mail, phone, address)"),
  copyright: z.string().min(1, "Copyright text is required"),
  selectedCategoryIds: z
    .array(z.string())
    .max(3, "Maximum three categories allowed"),
});

// GET: Fetch footer data, including selected categories
export async function GET(request: Request) {
  try {
    // Log to verify API is being called
    const url = new URL(request.url);
    console.log("Footer API GET called at:", new Date().toISOString(), "with params:", url.searchParams.get('t'));
    
    let footer = await prisma.footer.findFirst();
    if (!footer) {
      // Create default footer if none exists
      const defaultCategories = await prisma.category.findMany({
        where: { isActive: true },
        take: 3,
        select: { id: true },
      });
      footer = await prisma.footer.create({
        data: {
          companyTitle: "SouvenirShop",
          companyDescription:
            "Your one-stop shop for custom souvenirs, personalized gifts, and unique memorabilia.",
          socialLinks: [
            { platform: "facebook", href: "#" },
            { platform: "twitter", href: "#" },
            { platform: "instagram", href: "#" },
          ],
          customerServiceTitle: "Customer Service",
          customerServiceLinks: [
            { text: "Contact Us", href: "/contact" },
            { text: "Shipping Info", href: "/shipping" },
            { text: "Returns & Exchanges", href: "/returns" },
            { text: "FAQ", href: "/faq" },
          ],
          contactTitle: "Contact Info",
          contacts: [
            {
              icon: "mail",
              text: "info@souvenirshop.com",
              href: "mailto:info@souvenirshop.com",
            },
            {
              icon: "phone",
              text: "+1 (555) 123-4567",
              href: "tel:+15551234567",
            },
            { icon: "map", text: "123 Main St, City, State 12345" },
          ],
          copyright: "© 2024 SouvenirShop. All rights reserved.",
          selectedCategoryIds: defaultCategories.map((cat: { id: string }) => cat.id),
        },
      });
    }
    // Fetch category details for selectedCategoryIds
    const categories = await prisma.category.findMany({
      where: { id: { in: footer.selectedCategoryIds }, isActive: true },
      select: { id: true, name: true, slug: true },
    });
    
    const response = NextResponse.json({ ...footer, categories });
    // Add cache headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}

// PUT: Update footer data with validated input
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Footer PUT received data:", JSON.stringify(body, null, 2));
    
    const validatedData = footerSchema.parse(body);
    console.log("Footer validated data:", JSON.stringify(validatedData, null, 2));

    const existingFooter = await prisma.footer.findFirst();
    if (!existingFooter) {
      console.error("Footer not found in database");
      return NextResponse.json({ error: "Footer not found" }, { status: 404 });
    }

    // Verify category IDs exist and are active (only if categories are provided)
    const categoryIds = validatedData.selectedCategoryIds || [];
    console.log("Category IDs to validate:", categoryIds);
    
    if (categoryIds.length > 0) {
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds }, isActive: true },
      });
      console.log("Found categories:", categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
      
      if (categories.length !== categoryIds.length) {
        console.error(`Category validation failed. Requested: ${categoryIds.length}, Found: ${categories.length}`);
        const foundIds = categories.map((c: { id: string }) => c.id);
        const missingIds = categoryIds.filter((id: string) => !foundIds.includes(id));
        console.error("Missing category IDs:", missingIds);
        return NextResponse.json(
          { error: `One or more category IDs are invalid or inactive: ${missingIds.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const updatedFooter = await prisma.footer.update({
      where: { id: existingFooter.id },
      data: {
        ...validatedData,
        selectedCategoryIds: validatedData.selectedCategoryIds,
      },
    });

    // Include category details in response
    const updatedCategories = await prisma.category.findMany({
      where: { id: { in: updatedFooter.selectedCategoryIds }, isActive: true },
      select: { id: true, name: true, slug: true },
    });

    const response = NextResponse.json({
      ...updatedFooter,
      categories: updatedCategories,
    });
    
    // Add cache headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Footer update error:", error);
    return NextResponse.json(
      { error: "Failed to update footer" },
      { status: 500 }
    );
  }
}
