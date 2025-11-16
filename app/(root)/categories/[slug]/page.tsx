/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";

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

    // Check if this is the "Low Budget" category by slug
    const isLowBudgetCategory = slug === "low-budget" || category.name.toLowerCase().includes("low budget");

    // Build where clause
    const whereClause: any = {
      status: "ACTIVE",
      isActive: true,
    };

    if (isLowBudgetCategory) {
      // For low budget category, show all products where isLowBudget = true
      whereClause.isLowBudget = true;
    } else {
      // For normal categories, filter by categoryId
      whereClause.categoryId = { in: categoryIds };
    }

    // Get products
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        category: {
          select: { name: true, slug: true },
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
      <section className="bg-white dark:bg-slate-900 min-h-[60vh] border-b mt-8">
        <div className="container max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b pb-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl text-base">
                  {category.description}
                </p>
              )}
            </div>
            {/* You can add a sort dropdown or filter here if needed */}
          </div>

          {formattedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {formattedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-800 rounded-lg border mt-8">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Check back later for new products in this category.
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-700 transition"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    notFound();
  }
}
