import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Check if database is connected
    await prisma.$connect();

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null, // Only get parent categories
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);

    // Return empty array instead of error to prevent client crashes
    return NextResponse.json([]);
  }
}
