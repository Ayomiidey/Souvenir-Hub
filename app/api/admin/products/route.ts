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

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { where: { isMain: true }, take: 1 },
          category: { select: { name: true, slug: true } },
          _count: { select: { orderItems: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price) || 0,
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
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

    const requiredFields = ["name", "sku", "price", "quantity", "categoryId"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (isNaN(Number(body.price)) || Number(body.price) <= 0) {
      return NextResponse.json(
        { message: "Price must be a positive number" },
        { status: 400 }
      );
    }

    if (isNaN(Number(body.quantity)) || Number(body.quantity) < 0) {
      return NextResponse.json(
        { message: "Quantity must be a non-negative number" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
        description: body.description,
        shortDescription: body.shortDescription,
        sku: body.sku,
        price: Number(body.price),
        comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
        costPrice: body.costPrice ? Number(body.costPrice) : null,
        quantity: Number(body.quantity),
        lowStockThreshold: body.lowStockThreshold || 5,
        weight: body.weight,
        dimensions: body.dimensions,
        allowCustomPrint: body.allowCustomPrint || false,
        printPrice: body.printPrice ? Number(body.printPrice) : null,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        metaKeywords: body.metaKeywords,
        status: body.status || "DRAFT",
        isActive: body.isActive || true,
        isFeatured: body.isFeatured || false,
        categoryId: body.categoryId,
        deliveryTime: body.deliveryTime || null,
        images: {
          create:
            body.images?.map(
              (image: { url: string; altText: string }, index: number) => ({
                url: image.url,
                altText: image.altText,
                sortOrder: index,
                isMain: index === 0,
              })
            ) || [],
        },
        priceTiers: {
          create:
            body.priceTiers?.map((tier: any) => ({
              minQuantity: tier.minQuantity,
              discountType: tier.discountType,
              discountValue: Number(tier.discountValue),
              isActive: true,
            })) || [],
        },
      },
      include: { images: true, category: true, priceTiers: true },
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
