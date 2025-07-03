/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // Await the params and searchParams in Next.js 15
  const { slug } = await params;
  const { page: pageParam, sortBy } = await searchParams;

  const page = Number.parseInt(pageParam || "1");
  const sortByValue = sortBy || "popularity";
  const limit = 12;
  const skip = (page - 1) * limit;

  try {
    // Find category
    const category = await prisma.category.findUnique({
      where: { slug: slug, isActive: true },
      include: {
        children: {
          where: { isActive: true },
        },
      },
    });

    if (!category) {
      notFound();
    }

    // Get category IDs to include (parent + children)
    const categoryIds = [
      category.id,
      ...category.children.map((child) => child.id),
    ];

    // Build orderBy
    let orderBy: any = { createdAt: "desc" };
    switch (sortByValue) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get products
    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: "ACTIVE",
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        category: {
          select: { name: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
    }));

    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-2">
                {category.description}
              </p>
            )}
          </div>

          {formattedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Check back later for new products in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
