import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { carouselSchema } from "@/lib/validations/carousel-schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carousel = await prisma.carousel.findUnique({
      where: { id: id },
    });
    if (!carousel) {
      return NextResponse.json(
        { error: "Carousel not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(carousel);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch carousel" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = carouselSchema.parse(body);
    const { id } = await params;
    const carousel = await prisma.carousel.update({
      where: { id: id },
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(carousel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update carousel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.carousel.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "Carousel deleted successfully" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete carousel" },
      { status: 500 }
    );
  }
}
