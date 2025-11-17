import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Debug endpoint to find and clean up duplicate or problematic states
export async function GET() {
  try {
    // Get all states with their IDs and exact names
    const allStates = await prisma.state.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        locations: true,
        _count: {
          select: {
            locations: true,
          },
        },
      },
    });

    // Find potential duplicates (case-insensitive)
    const stateMap = new Map<string, typeof allStates>();
    const duplicates: typeof allStates = [];

    allStates.forEach((state) => {
      const lowerName = state.name.toLowerCase().trim();
      if (stateMap.has(lowerName)) {
        duplicates.push(state);
        const existing = stateMap.get(lowerName);
        if (existing && !duplicates.includes(existing[0])) {
          duplicates.push(...existing);
        }
      } else {
        stateMap.set(lowerName, [state]);
      }
    });

    return NextResponse.json({
      total: allStates.length,
      states: allStates.map((s) => ({
        id: s.id,
        name: s.name,
        nameLength: s.name.length,
        hasWhitespace: s.name !== s.name.trim(),
        locationCount: s._count.locations,
        createdAt: s.createdAt,
      })),
      duplicates: duplicates.map((s) => ({
        id: s.id,
        name: s.name,
        exactName: JSON.stringify(s.name), // Shows hidden characters
        locationCount: s._count.locations,
      })),
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a specific state by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("id");

    if (!stateId) {
      return NextResponse.json(
        { error: "State ID is required" },
        { status: 400 }
      );
    }

    // Delete the state (cascade will delete locations)
    await prisma.state.delete({
      where: { id: stateId },
    });

    return NextResponse.json({
      success: true,
      message: "State deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting state:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
