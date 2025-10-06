import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          roles: {
            select: {
              role: {
                select: { name: true },
              },
            },
          },
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count(),
    ]);
    // Flatten roles to array of strings
    const usersWithRoles = users.map((user: typeof users[0]) => ({
      ...user,
      roles: user.roles?.map((ur: typeof user.roles[0]) => ur.role.name) || [],
      ordersCount: user._count.orders,
    }));
    return NextResponse.json({
      users: usersWithRoles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
