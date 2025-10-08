"use client";

import type React from "react";
import { useState, useEffect } from "react";
// Types for state/location
interface StateOption {
  id: string;
  name: string;
}
interface LocationOption {
  id: string;
  name: string;
  stateId: string;
  shippingFee: number | null;
}
import { useLoader } from "@/components/providers/loader-provider";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { clearCart } from "@/store/slices/cartSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckoutSummary } from "./checkout-summary";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MessageSquare, CreditCard } from "lucide-react";

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  firstName: string;
  lastName: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;

  country: string;
  paymentMethod: string;
  customerNotes: string;
}

export function CheckoutForm() {
  // State/location data
  const [statesList, setStatesList] = useState<StateOption[]>([]);
  const [locationsList, setLocationsList] = useState<LocationOption[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [locationShippingFee, setLocationShippingFee] = useState<number>(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(200000);
  const loader = useLoader();
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal } = useAppSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    customerName: session?.user?.name || "",
    customerEmail: session?.user?.email || "",
    customerPhone: "",
    firstName: "",
    lastName: "",
    company: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",

    country: "NG", // Set default country to Nigeria
    paymentMethod: "BANK_TRANSFER",
    customerNotes: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const isFreeShipping = subtotal >= freeShippingThreshold && selectedLocationId !== "";
  const shipping = isFreeShipping ? 0 : locationShippingFee;
  const tax = 0; // No tax applied
  const total = subtotal + shipping + tax;

  // Fetch free shipping threshold
  useEffect(() => {
    fetch("/api/settings/free-shipping-threshold")
      .then((res) => res.json())
      .then((data) => {
        if (data.value) {
          setFreeShippingThreshold(Number(data.value));
        }
      })
      .catch(() => console.error("Failed to load free shipping threshold"));
  }, []);

  // Fetch states and locations on mount
  useEffect(() => {
    fetch("/api/admin/states")
      .then((res) => res.json())
      .then((data) =>
        setStatesList(Array.isArray(data) ? data : data.states || [])
      )
      .catch(() => toast.error("Failed to load states"));
    fetch("/api/admin/locations")
      .then((res) => res.json())
      .then((data) =>
        setLocationsList(Array.isArray(data) ? data : data.locations || [])
      )
      .catch(() => toast.error("Failed to load locations"));
  }, []);

  // When state changes, reset location
  useEffect(() => {
    setSelectedLocationId("");
    setLocationShippingFee(0);
    setFormData((prev) => ({
      ...prev,
      state: statesList.find((s) => s.id === selectedStateId)?.name || "",
    }));
  }, [selectedStateId, statesList]);

  // When location changes, update shipping fee and formData
  useEffect(() => {
    if (!selectedLocationId) {
      setLocationShippingFee(0);
      setFormData((prev) => ({ ...prev, city: "" }));
      return;
    }
    const loc = locationsList.find((l) => l.id === selectedLocationId);
    if (!loc) {
      toast.error("Selected location not found");
      setLocationShippingFee(0);
      setFormData((prev) => ({ ...prev, city: "" }));
      return;
    }
    // Convert shippingFee to number safely
    const fee =
      typeof loc.shippingFee === "string"
        ? parseFloat(loc.shippingFee)
        : loc.shippingFee || 0;
    setLocationShippingFee(isNaN(fee) ? 0 : fee);
    setFormData((prev) => ({ ...prev, city: loc.name || "" }));
  }, [selectedLocationId, locationsList]);

  const generateWhatsAppMessage = (orderNumber: string) => {
    const orderDetails = `
🛍️ *NEW ORDER REQUEST - ${orderNumber}*

👤 *Customer Information:*
Name: ${formData.customerName}
Email: ${formData.customerEmail}
Phone: ${formData.customerPhone || "Not provided"}

📦 *Order Items:*
${items
  .map(
    (item, index) =>
      `${index + 1}. ${item.name}
   SKU: ${item.sku || "N/A"}
   Quantity: ${item.quantity}
   Unit Price: ₦${item.price.toFixed(2)}
   ${item.customPrint ? `Custom Print: "${item.printText}"` : ""}
   Subtotal: ₦${(item.price * item.quantity).toFixed(2)}`
  )
  .join("\n\n")}

📍 *Shipping Address:*
${formData.firstName} ${formData.lastName}
${formData.company ? `${formData.company}\n` : ""}${formData.addressLine1}
${formData.addressLine2 ? `${formData.addressLine2}\n` : ""}${formData.city}, ${
      formData.state
    } 
${formData.country}

💰 *Order Summary:*
Subtotal: ₦${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? (isFreeShipping ? "FREE" : "₦0.00") : `₦${shipping.toFixed(2)}`}
Tax: ₦${tax.toFixed(2)}
*Total: ₦${total.toFixed(2)}*

💳 *Payment Method:* WhatsApp Payment

${
  formData.customerNotes ? `📝 *Special Notes:*\n${formData.customerNotes}` : ""
}

Please confirm this order and provide payment instructions. Thank you! 🙏
    `.trim();

    return encodeURIComponent(orderDetails);
  };

  const handleWhatsAppOrder = async () => {
    loader.show();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const requiredFields: (keyof FormData)[] = [
      "customerName",
      "customerEmail",
      "firstName",
      "lastName",
      "addressLine1",
      "city",
      "state",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        customPrint: item.customPrint,
        printText: item.printText,
      })),
      customerInfo: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,

        country: formData.country,
      },
      paymentMethod: "WHATSAPP",
      customerNotes: formData.customerNotes,
      totals: { subtotal, shipping, tax, total },
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const order = await response.json();
      const message = generateWhatsAppMessage(order.orderNumber);
      const whatsappNumber = "+2348068005956";
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${message}`;
      window.location.href = whatsappUrl;
      dispatch(clearCart());
      toast.success(
        "Proceed to send order on WhatsApp. Redirecting to WhatsApp..."
      );
      router.push(`/orders/${order.id}/confirmation`);
    } else {
      const error = await response.json();
      toast.error(error.message || "Failed to create order");
    }
    loader.hide();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    loader.show();
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (formData.paymentMethod === "WHATSAPP") {
      handleWhatsAppOrder();
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          customPrint: item.customPrint,
          printText: item.printText,
          // Add productName and productSku for email reliability
          productName: item.name,
          productSku: item.sku,
        })),
        customerInfo: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,

          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes,
        totals: { subtotal, shipping, tax, total },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();

        if (formData.paymentMethod === "BANK_TRANSFER") {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          });
        }

        dispatch(clearCart());
        toast.success(
          "Order placed successfully! Check your email for confirmation."
        );
        router.push(`/orders/${order.id}/confirmation`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Order submission error:", error);
    } finally {
      setLoading(false);
      loader.hide();
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to continue with checkout
        </p>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleInputChange("customerName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    handleInputChange("customerEmail", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  handleInputChange("customerPhone", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="">-- Select State --</option>
                  {statesList.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="city">Location *</Label>
                <select
                  id="city"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                  disabled={!selectedStateId}
                >
                  <option value="">-- Select Location --</option>
                  {locationsList
                    .filter((l) => l.stateId === selectedStateId)
                    .map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Bank Transfer
                  </div>
                </SelectItem>
                <SelectItem value="WHATSAPP">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp Payment
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {formData.paymentMethod === "BANK_TRANSFER" && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Bank:</strong> Example Bank
                  </p>
                  <p>
                    <strong>Account Name:</strong> Souvenir Shop LLC
                  </p>
                  <p>
                    <strong>Account Number:</strong> 1234567890
                  </p>
                  <p>
                    <strong>Routing Number:</strong> 123456789
                  </p>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Please include your order number in the transfer reference
                </Badge>
              </div>
            )}

            {formData.paymentMethod === "WHATSAPP" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium mb-2 text-green-800">
                  WhatsApp Payment
                </h4>
                <p className="text-sm text-green-700 mb-3">
                  Click &quot;Place Order on WhatsApp&quot; to send your order
                  details directly to our WhatsApp for instant processing and
                  payment instructions.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <MessageSquare className="h-3 w-3" />
                  <span>Fast • Secure • Personal Service</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Order Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Special instructions for your order..."
              value={formData.customerNotes}
              onChange={(e) =>
                handleInputChange("customerNotes", e.target.value)
              }
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start space-y-6">
        <CheckoutSummary
          shipping={locationShippingFee}
          isFreeShippingEligible={
            subtotal >= freeShippingThreshold && selectedLocationId !== ""
          }
          freeShippingThreshold={freeShippingThreshold}
        />
        {formData.paymentMethod === "WHATSAPP" ? (
          <Button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Place Order on WhatsApp
          </Button>
        ) : (
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        )}
        <div className="text-xs text-muted-foreground text-center">
          By placing your order, you agree to our terms and conditions.
        </div>
      </div>
    </form>
  );
}
