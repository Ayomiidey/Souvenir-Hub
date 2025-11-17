import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "1000"); // Increased default to show all states
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * limit;
  
  try {
    // Build where clause for search
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [states, total] = await Promise.all([
      prisma.state.findMany({
        where,
        orderBy: { name: "asc" },
        include: { locations: { orderBy: { name: "asc" } } },
        skip,
        take: limit,
      }),
      prisma.state.count({ where }),
    ]);
    
    return NextResponse.json({
      states,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    return NextResponse.json(
      { error: "Failed to fetch states" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "State name is required" },
        { status: 400 }
      );
    }

    const state = await prisma.state.create({ data: { name: name.trim() } });
    return NextResponse.json(state);
  } catch (error: unknown) {
    console.error("Error creating state:", error);
    
    // Check for unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "A state with this name already exists" },
        { status: 409 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Failed to create state";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
