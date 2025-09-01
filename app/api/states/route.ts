import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(states);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch states" },
      { status: 500 }
    );
  }
}
