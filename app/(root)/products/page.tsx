import { ProductsPageClient } from "@/components/products/products-page-client";
import prisma from "@/lib/prisma";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Get categories for filter sidebar
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      children: {
        where: { isActive: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Get price range for filter
  const priceRange = await prisma.product.aggregate({
    where: {
      status: "ACTIVE",
      isActive: true,
    },
    _min: { price: true },
    _max: { price: true },
  });

  const minPrice = Number(priceRange._min.price) || 0;
  const maxPrice = Number(priceRange._max.price) || 1000;

  return (
    <ProductsPageClient
      categories={categories}
      priceRange={{ min: minPrice, max: maxPrice }}
      searchParams={await searchParams}
    />
  );
}
