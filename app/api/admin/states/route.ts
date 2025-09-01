import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const states = await prisma.state.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ states });
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
