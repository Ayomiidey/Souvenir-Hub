import prisma from "@/lib/prisma";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  printPrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string; slug: string };
  quantity: number;
  sku: string;
  allowCustomPrint: boolean;
  isFeatured: boolean;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

export interface HomePageData {
  categories: Category[];
  priceRange: { min: number; max: number };
  featuredProducts: Product[];
}

async function getCategories(): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: {
                status: "ACTIVE",
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const result = await prisma.product.aggregate({
      where: {
        status: "ACTIVE",
        isActive: true,
      },
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
  } catch (error) {
    console.error("Error fetching price range:", error);
    return { min: 0, max: 1000 };
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
      },
      include: {
        images: {
          select: {
            url: true,
            altText: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
          take: 1,
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });

    // Convert Decimal to number for JSON serialization
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
    }));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const [categories, priceRange, featuredProducts] = await Promise.all([
    getCategories(),
    getPriceRange(),
    getFeaturedProducts(),
  ]);

  return {
    categories,
    priceRange,
    featuredProducts,
  };
}
