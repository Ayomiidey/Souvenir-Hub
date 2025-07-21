import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductDetail } from "@/components/products/product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    // Fetch the main product
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        status: "ACTIVE",
        isActive: true,
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

    // Fetch related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "ACTIVE",
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        category: {
          select: { name: true, slug: true },
        },
        priceTiers: {
          where: { isActive: true },
          orderBy: { minQuantity: "asc" },
        },
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal prices to numbers
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

    const formattedRelatedProducts = relatedProducts.map((relatedProduct) => ({
      ...relatedProduct,
      price: Number(relatedProduct.price),
      comparePrice: relatedProduct.comparePrice
        ? Number(relatedProduct.comparePrice)
        : null,
      printPrice: relatedProduct.printPrice
        ? Number(relatedProduct.printPrice)
        : null,
      priceTiers: relatedProduct.priceTiers.map((tier) => ({
        ...tier,
        discountValue: Number(tier.discountValue),
      })),
    }));

    return (
      <ProductDetail
        product={formattedProduct}
        relatedProducts={formattedRelatedProducts}
      />
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
        status: "ACTIVE",
        isActive: true,
      },
      select: {
        name: true,
        shortDescription: true,
        images: {
          select: { url: true },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    return {
      title: product.name,
      description:
        product.shortDescription || `Shop ${product.name} at SouvenirShop`,
      openGraph: {
        title: product.name,
        description:
          product.shortDescription || `Shop ${product.name} at SouvenirShop`,
        images: product.images.length > 0 ? [product.images[0].url] : [],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Product Not Found",
    };
  }
}
