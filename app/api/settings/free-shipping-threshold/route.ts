import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch the free shipping threshold
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "free_shipping_threshold" },
    });

    if (!setting) {
      // Return default value if not set
      return NextResponse.json({ value: "200000" });
    }

    return NextResponse.json({ value: setting.value });
  } catch (error) {
    console.error("Error fetching free shipping threshold:", error);
    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}

// POST: Update the free shipping threshold
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { value } = body;

    if (!value || isNaN(Number(value))) {
      return NextResponse.json(
        { error: "Invalid value provided" },
        { status: 400 }
      );
    }

    // Upsert the setting
    const setting = await prisma.setting.upsert({
      where: { key: "free_shipping_threshold" },
      update: {
        value: String(value),
        type: "NUMBER",
      },
      create: {
        key: "free_shipping_threshold",
        value: String(value),
        type: "NUMBER",
      },
    });

    return NextResponse.json({
      success: true,
      value: setting.value,
    });
  } catch (error) {
    console.error("Error updating free shipping threshold:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
