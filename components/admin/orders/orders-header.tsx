"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter, RefreshCw } from "lucide-react";

interface OrdersHeaderProps {
  onFilterChange: (filters: {
    search?: string;
    status?: string;
    paymentStatus?: string;
  }) => void;
}

export function OrdersHeader({ onFilterChange }: OrdersHeaderProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const handleFilter = () => {
    onFilterChange({
      search: search || undefined,
      status: status !== "all" ? status : undefined,
      paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
    });
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            Order Management
          </h2>
          <p className="text-gray-600 text-sm">Track orders, update status, and manage fulfillment</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[250px] max-w-sm">
          <div className="relative">
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFilter()}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white"
            />
          </div>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleFilter} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
