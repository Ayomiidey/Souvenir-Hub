// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const previousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate()
    );

    // Get current month stats
    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      // Total revenue this month
      prisma.order.aggregate({
        where: {
          createdAt: { gte: lastMonth },
          paymentStatus: "PAID",
        },
        _sum: { totalAmount: true },
      }),

      // Total orders this month
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonth },
        },
      }),

      // Total products
      prisma.product.count({
        where: { isActive: true },
      }),

      // Total customers
      prisma.user.count({
        where: {
          roles: {
            some: {
              role: { name: "USER" },
            },
          },
        },
      }),

      // Pending orders
      prisma.order.count({
        where: { status: "PENDING" },
      }),

      // Low stock products
      prisma.product.count({
        where: {
          isActive: true,
          quantity: { lte: 10 }, // Replace with actual threshold if defined
        },
      }),
    ]);

    // Get previous month stats for comparison
    const [prevRevenue, prevOrders, prevCustomers] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: { gte: previousMonth, lt: lastMonth },
          paymentStatus: "PAID",
        },
        _sum: { totalAmount: true },
      }),

      prisma.order.count({
        where: {
          createdAt: { gte: previousMonth, lt: lastMonth },
        },
      }),

      prisma.user.count({
        where: {
          createdAt: { gte: previousMonth, lt: lastMonth },
          roles: {
            some: {
              role: { name: "USER" },
            },
          },
        },
      }),
    ]);

    // Safely convert Decimal to number with fallbacks
    const currentRevenue = totalRevenue._sum.totalAmount?.toNumber() ?? 0;
    const prevRevenueValue = prevRevenue._sum.totalAmount?.toNumber() ?? 0;
    const currentOrders = totalOrders;
    const prevOrdersValue = prevOrders;
    const currentCustomers = totalCustomers;
    const prevCustomersValue = prevCustomers;

    // Calculate percentage changes with type safety
    const revenueChange =
      prevRevenueValue !== 0
        ? Math.round(
            ((currentRevenue - prevRevenueValue) / prevRevenueValue) * 100
          )
        : currentRevenue > 0
          ? 100
          : 0;

    const ordersChange =
      prevOrdersValue !== 0
        ? Math.round(
            ((currentOrders - prevOrdersValue) / prevOrdersValue) * 100
          )
        : currentOrders > 0
          ? 100
          : 0;

    const customersChange =
      prevCustomersValue !== 0
        ? Math.round(
            ((currentCustomers - prevCustomersValue) / prevCustomersValue) * 100
          )
        : currentCustomers > 0
          ? 100
          : 0;

    return NextResponse.json({
      totalRevenue: currentRevenue,
      totalOrders: currentOrders,
      totalProducts,
      totalCustomers: currentCustomers,
      revenueChange,
      ordersChange,
      productsChange: 0, // Products don't change monthly typically
      customersChange,
      pendingOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
