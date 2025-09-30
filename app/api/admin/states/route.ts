import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
  try {
    const [states, total] = await Promise.all([
      prisma.state.findMany({
        orderBy: { name: "asc" },
        include: { locations: { orderBy: { name: "asc" } } },
        skip,
        take: limit,
      }),
      prisma.state.count(),
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch states" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { name } = await req.json();
  try {
    const state = await prisma.state.create({ data: { name } });
    return NextResponse.json(state);
  } catch {
    return NextResponse.json(
      { error: "Failed to create state" },
      { status: 500 }
    );
  }
}
