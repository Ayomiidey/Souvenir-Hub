// app/api/footer/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma"; // Adjust path to your Prisma client

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
});

export async function GET() {
  try {
    let footer = await prisma.footer.findFirst();
    if (!footer) {
      // Create default if none exists
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
        },
      });
    }
    return NextResponse.json(footer);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = footerSchema.parse(body);

    const existingFooter = await prisma.footer.findFirst();
    if (!existingFooter) {
      return NextResponse.json({ error: "Footer not found" }, { status: 404 });
    }

    const updatedFooter = await prisma.footer.update({
      where: { id: existingFooter.id },
      data: validatedData,
    });

    return NextResponse.json(updatedFooter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update footer" },
      { status: 500 }
    );
  }
}
