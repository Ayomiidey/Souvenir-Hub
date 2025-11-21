"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { RecentOrders } from "./recent-orders";
// import { SalesChart } from "./sales-chart";
// import { TopProducts } from "./top-products";
import { LowStockAlert } from "./low-stock-alert";
import Link from "next/link";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-100/50 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded shimmer w-20"></div>
                <div className="h-8 w-8 bg-muted rounded shimmer"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded shimmer w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded shimmer w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      description: "from last month",
    },
    {
      title: "Products",
      value: stats.totalProducts.toLocaleString(),
      change: stats.productsChange,
      icon: Package,
      description: "total products",
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: stats.customersChange,
      icon: Users,
      description: "from last month",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0">
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      {/* Alert Cards */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.pendingOrders > 0 && (
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 via-orange-25 to-orange-50 dark:border-orange-800 dark:bg-gradient-to-br dark:from-orange-950 dark:via-orange-900 dark:to-orange-950 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Pending Orders
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {stats.pendingOrders}
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Orders awaiting processing
                </p>
                <Button size="sm" className="mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0" asChild>
                  <Link href="/admin/orders?status=pending">View Orders</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {stats.lowStockProducts > 0 && (
            <Card className="border-red-200 bg-gradient-to-br from-red-50 via-red-25 to-red-50 dark:border-red-800 dark:bg-gradient-to-br dark:from-red-950 dark:via-red-900 dark:to-red-950 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
                  Low Stock Alert
                </CardTitle>
                <Package className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {stats.lowStockProducts}
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Products running low
                </p>
                <Button size="sm" className="mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0" asChild>
                  <Link href="/admin/products?filter=low-stock">
                    View Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-100/50 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg">
                <stat.icon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.change !== 0 && (
                  <>
                    {stat.change > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        stat.change > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="ml-1">{stat.description}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Revenue and orders over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts />
          </CardContent>
        </Card>
      </div> */}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-100/50 shadow-lg">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-100/50 shadow-lg">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <LowStockAlert />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
