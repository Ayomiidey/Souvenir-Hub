"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersHeader } from "@/components/admin/orders/orders-header";

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    paymentStatus: searchParams.get("paymentStatus") || "all",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  useEffect(() => {
    // Update filters when URL parameters change (e.g., navigation)
    const newFilters = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      paymentStatus: searchParams.get("paymentStatus") || "all",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };
    setFilters(newFilters);
  }, [searchParams]);

  const handleFilterChange = (newFilters: {
    search?: string;
    status?: string;
    paymentStatus?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage customer orders and fulfillment
          </p>
        </div>
        <div className="space-y-6">
          <OrdersHeader onFilterChange={handleFilterChange} />
          <OrdersTable filters={filters} />
        </div>
      </div>
    </main>
  );
}
