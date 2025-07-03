import { ProductDetail } from "@/components/products/product-detail";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params in Next.js 15
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        isActive: true,
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        category: {
          select: { name: true, slug: true },
        },
        priceTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
      },
    });

    if (!product) {
      notFound();
    }

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
        status: "ACTIVE",
      },
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
        category: {
          select: { name: true },
        },
      },
      take: 4,
    });

    // Format the product data
    const formattedProduct = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
      priceTiers: product.priceTiers.map((tier) => ({
        ...tier,
        discountValue: Number(tier.discountValue),
      })),
    };

    const formattedRelatedProducts = relatedProducts.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      printPrice: product.printPrice ? Number(product.printPrice) : null,
    }));

    return (
      <div className="container py-8">
        <ProductDetail
          product={formattedProduct}
          relatedProducts={formattedRelatedProducts}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
