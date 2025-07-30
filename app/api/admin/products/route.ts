/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category && category !== "all") {
      where.category = { slug: category };
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            where: { isMain: true },
            take: 1,
          },
          category: {
            select: { name: true, slug: true },
          },
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        shortDescription: body.shortDescription,
        sku: body.sku,
        price: body.price,
        comparePrice: body.comparePrice,
        costPrice: body.costPrice,
        quantity: body.quantity,
        lowStockThreshold: body.lowStockThreshold || 5,
        weight: body.weight,
        dimensions: body.dimensions,
        allowCustomPrint: body.allowCustomPrint || false,
        printPrice: body.printPrice,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        metaKeywords: body.metaKeywords,
        status: body.status || "DRAFT",
        isActive: body.isActive || false,
        isFeatured: body.isFeatured || false,
        categoryId: body.categoryId,
        images: {
          create:
            body.images?.map((image: any, index: number) => ({
              url: image.url,
              altText: image.altText,
              sortOrder: index,
              isMain: index === 0,
            })) || [],
        },
        priceTiers: {
          create:
            body.priceTiers?.map((tier: any) => ({
              minQuantity: tier.minQuantity,
              discountType: tier.discountType,
              discountValue: tier.discountValue,
              isActive: true,
            })) || [],
        },
      },
      include: {
        images: true,
        category: true,
        priceTiers: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
