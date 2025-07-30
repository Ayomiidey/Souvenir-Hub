// app/api/admin/analytics/sales/route.ts
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = Number.parseInt(searchParams.get("period") || "30");

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - period);

    const salesData = (await prisma.$queryRaw`
      SELECT 
        DATE(created_at) AS date,
        COALESCE(SUM(total_amount), 0) AS revenue,
        COALESCE(COUNT(*), 0) AS orders
      FROM orders 
      WHERE created_at >= ${startDate} 
        AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `) as Array<{ date: Date; revenue: number; orders: number }>;

    const formattedData = salesData.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      revenue: Number(item.revenue),
      orders: Number(item.orders),
    }));

    if (formattedData.length === 0) {
      const emptyData = Array.from({ length: period }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split("T")[0],
          revenue: 0,
          orders: 0,
        };
      });
      return NextResponse.json(emptyData);
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
