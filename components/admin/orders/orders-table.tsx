"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  totalAmount: number | string | undefined;
  createdAt: string;
  items: Array<{
    quantity: number;
    product: { name: string };
  }>;
}

export function OrdersTable({
  filters,
}: {
  filters: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toUpperCase() }),
      });

      if (response.ok) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteProduct = (id: string) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-950 rounded-md shadow p-4 flex items-center gap-4 text-black">
        <span>Are you sure you want to delete this order?</span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await fetch(`/api/admin/orders/${id}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  setOrders((prev) => prev.filter((order) => order.id !== id));
                  toast.success("Order deleted successfully!");
                } else {
                  const data = await response.json();
                  toast.error(data.message || "Failed to delete order");
                }
              } catch (error) {
                console.error("Error deleting order:", error);
                toast.error("Error deleting order");
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "awaiting_payment":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100/50 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          Orders ({orders.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <thead className="bg-gradient-to-r from-red-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100/50 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
        Orders ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead className="bg-gradient-to-r from-red-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">
                            {order.items && order.items.length > 0
                              ? order.items.reduce((sum, item) => sum + item.quantity, 0)
                              : 0} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        ₦{typeof order.totalAmount === "number"
                          ? order.totalAmount.toFixed(2)
                          : typeof order.totalAmount === "string"
                            ? parseFloat(order.totalAmount).toFixed(2)
                            : "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4 text-red-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(order.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Update Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {orders.some(order => order.status === "PENDING") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const pendingOrders = orders.filter(o => o.status === "PENDING");
                    pendingOrders.forEach(order => handleUpdateOrderStatus(order.id, "CONFIRMED"));
                  }}
                  className="bg-white/80 hover:bg-white border-gray-200 text-blue-600 hover:text-blue-700 hover:border-blue-300"
                >
                  Confirm All Pending
                </Button>
              )}
              {orders.some(order => order.status === "CONFIRMED") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const confirmedOrders = orders.filter(o => o.status === "CONFIRMED");
                    confirmedOrders.forEach(order => handleUpdateOrderStatus(order.id, "PROCESSING"));
                  }}
                  className="bg-white/80 hover:bg-white border-gray-200 text-purple-600 hover:text-purple-700 hover:border-purple-300"
                >
                  Process All Confirmed
                </Button>
              )}
              {orders.some(order => order.status === "PROCESSING") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const processingOrders = orders.filter(o => o.status === "PROCESSING");
                    processingOrders.forEach(order => handleUpdateOrderStatus(order.id, "SHIPPED"));
                  }}
                  className="bg-white/80 hover:bg-white border-gray-200 text-orange-600 hover:text-orange-700 hover:border-orange-300"
                >
                  Ship All Processing
                </Button>
              )}
              {orders.some(order => order.status === "SHIPPED") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const shippedOrders = orders.filter(o => o.status === "SHIPPED");
                    shippedOrders.forEach(order => handleUpdateOrderStatus(order.id, "DELIVERED"));
                  }}
                  className="bg-white/80 hover:bg-white border-gray-200 text-green-600 hover:text-green-700 hover:border-green-300"
                >
                  Deliver All Shipped
                </Button>
              )}
            </div>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <Button
                  key={pNum}
                  variant={pNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pNum)}
                  disabled={pNum === page}
                  className={pNum === page ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0" : "bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"}
                >
                  {pNum}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
