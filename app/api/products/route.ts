/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "popularity";
    const featured = searchParams.get("featured") === "true";
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = Number.parseFloat(
      searchParams.get("maxPrice") || "999999"
    );

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "ACTIVE",
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (inStockOnly) {
      where.quantity = { gt: 0 };
    }

    if (minPrice > 0 || maxPrice < 999999) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" }; // Default to newest for now
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          category: {
            select: { name: true, slug: true },
          },
          priceTiers: {
            where: { isActive: true },
            orderBy: { minQuantity: "asc" },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Convert Decimal prices to numbers
    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
      priceTiers: product.priceTiers.map((tier) => ({
        ...tier,
        discountValue: Number(tier.discountValue),
      })),
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
