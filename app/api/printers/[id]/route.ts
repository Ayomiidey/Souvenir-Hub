import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const printer = await prisma.printer.findUnique({
      where: { id },
      include: {
        state: true,
        location: true,
      },
    });
    if (!printer) {
      return NextResponse.json({ error: "Printer not found" }, { status: 404 });
    }

    return NextResponse.json({
  id: printer.id,
  name: printer.name,
  contact: printer.contact,
  email: printer.email,
  phone: printer.phone,
  whatsapp: printer.whatsapp,
  address: printer.address,
  description: printer.description,
  state: printer.state,
  location: printer.location,
  isActive: printer.isActive,
  createdAt: printer.createdAt,
  updatedAt: printer.updatedAt,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch printer" },
      { status: 500 }
    );
  }
}
