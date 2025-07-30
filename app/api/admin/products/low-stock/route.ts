import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { quantity: 0 },
          {
            quantity: {
              lte: prisma.product.fields.lowStockThreshold,
            },
          },
        ],
      },
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
      orderBy: { quantity: "asc" },
      take: limit,
    });

    const formattedData = lowStockProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || "/placeholder.svg",
      quantity: product.quantity,
      lowStockThreshold: product.lowStockThreshold,
      sku: product.sku,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
