import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("stateId");
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
  try {
    const where = stateId ? { stateId } : {};
    const [locations, total] = await Promise.all([
      prisma.location.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          stateId: true,
          shippingFee: true,
        },
        skip,
        take: limit,
      }),
      prisma.location.count({ where }),
    ]);
    return NextResponse.json({
      locations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { name, stateId, shippingFee } = await req.json();
  try {
    const data: { name: string; stateId: string; shippingFee?: number } = {
      name,
      stateId,
    };
    if (shippingFee !== undefined && shippingFee !== null) {
      data.shippingFee = shippingFee;
    }
    const location = await prisma.location.create({ data });
    return NextResponse.json(location);
  } catch (error) {
    console.error("Failed to create location:", error);
    return NextResponse.json(
      {
        error: "Failed to create location",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
