/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = Number.parseFloat(
      searchParams.get("maxPrice") || "999999"
    );
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sortBy") || "name";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");

    // Build where clause
    const where: any = {
      status: "ACTIVE",
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Price filtering - ensure we're comparing numbers properly
    if (minPrice > 0 || maxPrice < 999999) {
      where.price = {};
      if (minPrice > 0) {
        where.price.gte = minPrice;
      }
      if (maxPrice < 999999) {
        where.price.lte = maxPrice;
      }
    }

    if (inStock) {
      where.quantity = {
        gt: 0,
      };
    }

    // Build orderBy clause
    let orderBy: any = { name: "asc" };

    switch (sortBy) {
      case "name_desc":
        orderBy = { name: "desc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "featured":
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        break;
      default:
        orderBy = { name: "asc" };
    }

    // Get total count
    const totalCount = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: {
          select: {
            url: true,
            altText: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Convert Decimal prices to numbers for JSON serialization
    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
