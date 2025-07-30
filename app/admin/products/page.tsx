import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsHeader } from "@/components/admin/products/products-header";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsHeader />
      <ProductsTable />
    </div>
  );
}
