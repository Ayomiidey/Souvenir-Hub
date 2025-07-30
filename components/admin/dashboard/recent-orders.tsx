"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders?limit=5&sortBy=newest");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded shimmer w-32"></div>
              <div className="h-3 bg-muted rounded shimmer w-48"></div>
            </div>
            <div className="h-6 bg-muted rounded shimmer w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">#{order.orderNumber}</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {order.customerName} • {order.customerEmail}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No recent orders found
        </div>
      )}

      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/admin/orders">View All Orders</Link>
        </Button>
      </div>
    </div>
  );
}
