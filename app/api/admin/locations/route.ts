import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("stateId");
  try {
    const locations = await prisma.location.findMany({
      where: stateId ? { stateId } : {},
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        stateId: true,
        shippingFee: true,
      },
    });
    return NextResponse.json({ locations });
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
