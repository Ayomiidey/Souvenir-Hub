import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { carouselSchema } from "@/lib/validations/carousel-schema";

export async function GET() {
  try {
    const carousels = await prisma.carousel.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(carousels);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch carousels" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = carouselSchema.parse(body);

    const carousel = await prisma.carousel.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
      },
    });
    return NextResponse.json(carousel, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create carousel" },
      { status: 500 }
    );
  }
}
