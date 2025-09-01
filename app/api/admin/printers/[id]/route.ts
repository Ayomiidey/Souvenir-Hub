import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  const data = await req.json();
  try {
    const printer = await prisma.printer.update({
      where: { id: data.id },
      data: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        address: data.address,
        stateId: data.stateId,
        locationId: data.locationId,
        description: data.description,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(printer);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update printer" },
      { status: 500 }
    );
  }
}
