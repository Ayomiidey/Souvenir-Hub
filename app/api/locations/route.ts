import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      include: { state: true },
      orderBy: [{ state: { name: "asc" } }, { name: "asc" }],
    });
    return NextResponse.json(locations);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
