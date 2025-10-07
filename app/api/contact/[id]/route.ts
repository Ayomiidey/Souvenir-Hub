import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const updateStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "REPLIED"]),
});

// GET: Fetch a specific contact message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: params.id },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Contact message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to fetch contact message:", error);
    return NextResponse.json(
      { message: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

// PATCH: Update contact message status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Failed to update contact message:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Validation error",
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contactMessage.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Contact message deleted successfully" }
    );
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return NextResponse.json(
      { message: "Failed to delete message" },
      { status: 500 }
    );
  }
}