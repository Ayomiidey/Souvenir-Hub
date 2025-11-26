import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const printer = await prisma.printer.create({
      data: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        stateId: data.stateId,
        locationId: data.locationId,
        description: data.description,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(printer);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create printer" },
      { status: 500 }
    );
  }
}
