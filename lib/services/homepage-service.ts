import prisma from "@/lib/prisma";
import { Product } from "@/types/product";

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
        priceTiers: {
          select: {
            id: true,
            minQuantity: true,
            discountType: true,
            discountValue: true,
            isActive: true,
            productId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    });

    // Convert Decimal to number for JSON serialization and ensure all fields
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
      description: product.description || null, // Ensure inclusion
      shortDescription: product.shortDescription || null, // Ensure inclusion
      sku: product.sku || "", // Default value
      allowCustomPrint: product.allowCustomPrint || false, // Default value
      status: product.status || "ACTIVE", // Default value
      deliveryTime: product.deliveryTime || null, // Default value
      isActive: product.isActive || true, // Default value
      priceTiers:
        product.priceTiers?.map((tier) => ({
          minQuantity: tier.minQuantity,
          discountType: tier.discountType,
          discountValue: Number(tier.discountValue),
        })) || [], // Map and convert discountValue
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
