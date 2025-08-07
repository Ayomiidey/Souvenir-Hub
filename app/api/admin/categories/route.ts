/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CategoryWithChildren } from "@/types/category";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const parentId = searchParams.get("parentId") || "";
    const status = searchParams.get("status") || "";

    const where: any = { isActive: true };
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (parentId && parentId !== "all") {
      where.parentId = parentId;
    }
    if (status && status !== "all") {
      where.isActive = status === "active";
    }

    const categories = (await prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    })) as CategoryWithChildren[];

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCategory = (await prisma.category.create({
      data: {
        name,
        slug,
        isActive: true,
        sortOrder: sortOrder || 0,
        parentId: parentId || null,
      },
    })) as CategoryWithChildren;

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
