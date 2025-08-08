"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  Save,
  X,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string; // Decimal comes as string from Prisma
  customPrint?: boolean;
  printText?: string;
  product: {
    name: string;
    sku?: string;
    images: Array<{ url: string }>;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;

  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  // Pricing (all come as strings from Prisma Decimal)
  subtotal: string;
  taxAmount: string;
  shippingAmount: string;
  discountAmount: string;
  totalAmount: string;

  // Payment & shipping
  paymentMethod?: string;
  paymentReference?: string;
  shippingMethod?: string;
  trackingNumber?: string;

  // Notes
  customerNotes?: string;
  adminNotes?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;

  // Relations
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingAddress?: {
    id: string;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
        setTrackingNumber(orderData.trackingNumber || "");
        setAdminNotes(orderData.adminNotes || "");
      } else {
        toast.error("Order not found");
        router.push("/admin/orders");
      }
    } catch (error) {
      toast.error("Error fetching order");
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Order status updated successfully");
        fetchOrder();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error("Error updating order status");
      console.error("Error updating order status:", error);
    }
  };

  const handleSaveDetails = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber,
          adminNotes,
        }),
      });

      if (response.ok) {
        toast.success("Order details updated successfully");
        setIsEditing(false);
        fetchOrder();
      } else {
        toast.error("Failed to update order details");
      }
    } catch (error) {
      toast.error("Error updating order details");
      console.error("Error updating order details:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CONFIRMED":
      case "PROCESSING":
        return <Package className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "SHIPPED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "AWAITING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method?.toUpperCase()) {
      case "WHATSAPP":
        return <MessageSquare className="h-4 w-4" />;
      case "BANK_TRANSFER":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Helper function to safely convert string decimals to numbers
  const toNumber = (value: string | number | undefined): number => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    return parseFloat(value.toString());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="h-8 bg-muted rounded animate-pulse w-48"></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Order not found</h2>
          <p className="text-muted-foreground mt-2">
            The order you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Created on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(order.status)} variant="secondary">
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status}</span>
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Update Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleUpdateStatus("CONFIRMED")}
                disabled={order.status !== "PENDING"}
              >
                Mark as Confirmed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus("PROCESSING")}
                disabled={order.status !== "CONFIRMED"}
              >
                Mark as Processing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus("SHIPPED")}
                disabled={order.status !== "PROCESSING"}
              >
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateStatus("DELIVERED")}
                disabled={order.status !== "SHIPPED"}
              >
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUpdateStatus("CANCELLED")}
                disabled={["DELIVERED", "CANCELLED"].includes(order.status)}
                className="text-destructive"
              >
                Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => {
                  const unitPrice = toNumber(item.unitPrice);
                  const subtotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 py-4 border-b last:border-b-0"
                    >
                      <div className="relative h-16 w-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-muted">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{item.product.name}</h4>
                        {item.product.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.product.sku}
                          </p>
                        )}
                        <div className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity} × ₦{unitPrice.toFixed(2)}
                        </div>
                        {item.customPrint && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <div className="font-medium">Custom Print:</div>
                            <div>&quot;{item.printText}&quot;</div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}

                <Separator />

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₦{toNumber(order.subtotal).toFixed(2)}</span>
                  </div>
                  {toNumber(order.shippingAmount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>₦{toNumber(order.shippingAmount).toFixed(2)}</span>
                    </div>
                  )}
                  {toNumber(order.taxAmount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>₦{toNumber(order.taxAmount).toFixed(2)}</span>
                    </div>
                  )}
                  {toNumber(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₦{toNumber(order.discountAmount).toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₦{toNumber(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Name
                    </Label>
                    <p className="mt-1">{order.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <div className="flex items-center mt-1">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{order.customerEmail}</p>
                    </div>
                  </div>
                </div>
                {order.customerPhone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </Label>
                    <div className="flex items-center mt-1">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{order.customerPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  {order.shippingAddress.company && (
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.company}
                    </p>
                  )}
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <div className="flex items-center mt-2 pt-2 border-t">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{order.shippingAddress.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer Notes */}
          {order.customerNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {order.customerNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Status</span>
                <Badge
                  className={getStatusColor(order.status)}
                  variant="secondary"
                >
                  {order.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Status</span>
                <Badge
                  className={getPaymentStatusColor(order.paymentStatus)}
                  variant="secondary"
                >
                  {order.paymentStatus.replace("_", " ")}
                </Badge>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span>Payment Method</span>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(order.paymentMethod)}
                    <span className="ml-1 text-sm">
                      {order.paymentMethod === "BANK_TRANSFER"
                        ? "Bank Transfer"
                        : "WhatsApp"}
                    </span>
                  </div>
                </div>
              )}
              {order.paymentReference && (
                <div className="flex justify-between">
                  <span>Payment Ref</span>
                  <span className="text-sm font-mono">
                    {order.paymentReference}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Order Date</span>
                <span className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {order.shippedAt && (
                <div className="flex justify-between">
                  <span>Shipped Date</span>
                  <span className="text-sm">
                    {new Date(order.shippedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between">
                  <span>Delivered Date</span>
                  <span className="text-sm">
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking & Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tracking & Notes</CardTitle>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="tracking">Tracking Number</Label>
                    <Input
                      id="tracking"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Admin Notes</Label>
                    <Textarea
                      id="notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveDetails}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tracking Number
                    </Label>
                    <p className="mt-1">
                      {order.trackingNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Shipping Method
                    </Label>
                    <p className="mt-1">
                      {order.shippingMethod || "Standard Shipping"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Admin Notes
                    </Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {order.adminNotes || "No notes added"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
