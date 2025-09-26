import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
    });
    // Flatten roles to array of strings
    const usersWithRoles = users.map((user) => ({
      ...user,
      roles: user.roles?.map((ur) => ur.role.name) || [],
      ordersCount: user._count.orders,
    }));
    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
