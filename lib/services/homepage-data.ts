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

export interface PriceRange {
  min: number;
  max: number;
}

export interface HomePageData {
  categories: Category[];
  priceRange: PriceRange;
  featuredProducts: Product[];
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    // Fetch categories with product counts
    const categories = await prisma.category.findMany({
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

    // Get price range from all active products
    const priceRangeResult = await prisma.product.aggregate({
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

    // Fetch featured products for best sellers
    const featuredProductsRaw = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
      },
      // Select only the fields required by the Product interface
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        printPrice: true,
        quantity: true,
        sku: true,
        allowCustomPrint: true,
        isFeatured: true,
        status: true,
        images: {
          select: {
            url: true,
            altText: true,
          },
          orderBy: {
            sortOrder: "asc", // Corrected from 'order' to 'sortOrder'
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for JSON serialization
    const featuredProducts: Product[] = featuredProductsRaw.map((product) => ({
      ...product, // Spread all selected properties, including images and category
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
    }));

    return {
      categories,
      priceRange: {
        min: Number(priceRangeResult._min.price) || 0,
        max: Number(priceRangeResult._max.price) || 1000,
      },
      featuredProducts,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);

    // Return fallback data
    return {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      featuredProducts: [],
    };
  }
}
