import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("stateId");
  const locationId = searchParams.get("locationId");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (stateId) where.stateId = stateId;
    if (locationId) where.locationId = locationId;

    const printers = await prisma.printer.findMany({
      where,
      include: { state: true, location: true },
      orderBy: [
        { state: { name: "asc" } },
        { location: { name: "asc" } },
        { name: "asc" },
      ],
    });
    return NextResponse.json(printers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch printers" },
      { status: 500 }
    );
  }
}
