// app/api/admin/analytics/top-products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Interface for the raw SQL query result
interface RawTopProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: string | number;
  totalSold: string | number;
  revenue: string | number;
}

// Interface for the final response
interface TopProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  totalSold: number;
  revenue: number;
  price: number;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "5", 10);

    const topProducts = (await prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.slug,
        pi.url AS image,
        p.price,
        COALESCE(COUNT(oi.id), 0) AS totalSold,
        COALESCE(SUM(oi.totalPrice), 0) AS revenue
      FROM "products" p
      LEFT JOIN "order_items" oi ON p.id = oi.productId
      LEFT JOIN "product_images" pi ON p.id = pi.productId AND pi.isMain = true
      WHERE p.isActive = true
      GROUP BY p.id, p.name, p.slug, pi.url, p.price
      ORDER BY totalSold DESC
      LIMIT ${limit}
    `) as RawTopProduct[];

    const formattedProducts: TopProduct[] = topProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image || "/placeholder.svg",
      totalSold: Number(product.totalSold) || 0,
      revenue: Number(product.revenue) || 0,
      price: Number(product.price) || 0,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
