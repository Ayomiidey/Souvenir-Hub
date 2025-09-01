import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("stateId");
  try {
    const locations = await prisma.location.findMany({
      where: stateId ? { stateId } : {},
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ locations });
  } catch {
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, stateId } = await req.json();
  try {
    const location = await prisma.location.create({ data: { name, stateId } });
    return NextResponse.json(location);
  } catch {
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
