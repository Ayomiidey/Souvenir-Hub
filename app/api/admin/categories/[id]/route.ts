import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CategoryWithChildren, CategoryWithRelations } from "@/types/category";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const category = (await prisma.category.findUnique({
      where: { id },
      include: {
        children: { orderBy: { sortOrder: "asc" } },
      },
    })) as CategoryWithChildren | null;

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    const { name, parentId, sortOrder } = body;

    if (!id || !name) {
      return NextResponse.json(
        { message: "ID and name are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const updatedCategory = (await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        parentId: parentId || null,
        sortOrder: sortOrder || 0,
      },
    })) as CategoryWithChildren;

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = (await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    })) as CategoryWithRelations | null;

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (category.children?.length > 0 || category.products?.length > 0) {
      return NextResponse.json(
        { message: "Cannot delete category with children or products" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
