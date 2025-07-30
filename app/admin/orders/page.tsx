import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersHeader } from "@/components/admin/orders/orders-header";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <OrdersHeader />
      <OrdersTable />
    </div>
  );
}
