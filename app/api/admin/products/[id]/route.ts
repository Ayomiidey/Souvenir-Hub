/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        priceTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();

    const { id } = await params;

    if (
      !body.name ||
      !body.sku ||
      isNaN(Number(body.price)) ||
      !body.categoryId
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
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
        lowStockThreshold: body.lowStockThreshold,
        weight: body.weight,
        dimensions: body.dimensions,
        allowCustomPrint: body.allowCustomPrint,
        printPrice: body.printPrice ? Number(body.printPrice) : null,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        metaKeywords: body.metaKeywords,
        status: body.status,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        categoryId: body.categoryId,
        deliveryTime: body.deliveryTime || null,
      },
      include: { images: true, category: true, priceTiers: true },
    });

    if (body.images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: body.images.map(
          (image: { url: string; altText: string }, index: number) => ({
            productId: id,
            url: image.url,
            altText: image.altText,
            sortOrder: index,
            isMain: index === 0,
          })
        ),
      });
    }

    if (body.priceTiers) {
      await prisma.priceTier.deleteMany({ where: { productId: id } });
      await prisma.priceTier.createMany({
        data: body.priceTiers.map((tier: any) => ({
          productId: id,
          minQuantity: tier.minQuantity,
          discountType: tier.discountType,
          discountValue: Number(tier.discountValue),
          isActive: true,
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }
    const product = await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({
      message: `${product.name} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
