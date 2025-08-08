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
    <div className="space-y-6">
      <OrdersHeader onFilterChange={handleFilterChange} />
      <OrdersTable filters={filters} />
    </div>
  );
}
