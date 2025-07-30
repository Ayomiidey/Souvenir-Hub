// app/api/admin/products/[id]/route.ts
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
        images: {
          orderBy: { sortOrder: "asc" },
        },
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

    // Update product
    const product = await prisma.product.update({
      where: { id: id },
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
        lowStockThreshold: body.lowStockThreshold,
        weight: body.weight,
        dimensions: body.dimensions,
        allowCustomPrint: body.allowCustomPrint,
        printPrice: body.printPrice,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        metaKeywords: body.metaKeywords,
        status: body.status,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        categoryId: body.categoryId,
      },
    });

    // Update images if provided
    if (body.images) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      // Create new images
      await prisma.productImage.createMany({
        data: body.images.map((image: any, index: number) => ({
          productId: id,
          url: image.url,
          altText: image.altText,
          sortOrder: index,
          isMain: index === 0,
        })),
      });
    }

    // Update price tiers if provided
    if (body.priceTiers) {
      // Delete existing price tiers
      await prisma.priceTier.deleteMany({
        where: { productId: id },
      });

      // Create new price tiers
      await prisma.priceTier.createMany({
        data: body.priceTiers.map((tier: any) => ({
          productId: id,
          minQuantity: tier.minQuantity,
          discountType: tier.discountType,
          discountValue: tier.discountValue,
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
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
