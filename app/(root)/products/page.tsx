import { Suspense } from "react";
import { ProductsPageClient } from "@/components/products/products-page-client";
import prisma from "@/lib/prisma";

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getPriceRange() {
  try {
    const result = await prisma.product.aggregate({
      where: {
        status: "ACTIVE",
        isActive: true,
      },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      min: Number(result._min.price) || 0,
      max: Number(result._max.price) || 1000,
    };
  } catch (error) {
    console.error("Error fetching price range:", error);
    return { min: 0, max: 1000 };
  }
}

interface ProductsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const [categories, priceRange] = await Promise.all([
    getCategories(),
    getPriceRange(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageClient
        categories={categories}
        priceRange={priceRange}
        searchParams={searchParams}
      />
    </Suspense>
  );
}
