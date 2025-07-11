import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { ProductsPageClient } from "@/components/products/products-page-client";

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function getCategories() {
  return await prisma.category.findMany({
    where: {
      parentId: null, // Only get top-level categories
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

async function getPriceRange() {
  const result = await prisma.product.aggregate({
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
  });

  return {
    min: Number(result._min.price) || 0,
    max: Number(result._max.price) || 1000,
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const [categories, priceRange] = await Promise.all([
    getCategories(),
    getPriceRange(),
  ]);

  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="container py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-64 flex-shrink-0">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-muted rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <ProductsPageClient
          categories={categories}
          priceRange={priceRange}
          searchParams={resolvedSearchParams}
        />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Products | SouvenirShop",
  description:
    "Browse our collection of custom souvenirs and personalized gifts.",
};
