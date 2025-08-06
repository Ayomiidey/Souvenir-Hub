export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  allowCustomPrint: boolean;
  printPrice?: number | null;
  images: { url: string; altText: string | null }[];
  category: { name: string; slug: string };
  priceTiers?: Array<{
    minQuantity: number;
    discountType: string;
    discountValue: number;
  }>;
  status: string;
  deliveryTime?: string | null;
  isActive?: boolean;
}
