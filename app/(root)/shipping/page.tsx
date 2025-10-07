import { Truck, Clock, MapPin, DollarSign, Package, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Fast, reliable shipping options to get your orders delivered quickly
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-700">Standard Shipping</CardTitle>
              <CardDescription>Most economical option</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-green-600">$4.99</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                3-5 Business Days
              </Badge>
              <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-700">Express Shipping</CardTitle>
              <CardDescription>Faster delivery option</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-blue-600">$9.99</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                1-2 Business Days
              </Badge>
              <p className="text-sm text-gray-600">Perfect for urgent orders</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-purple-700">Overnight</CardTitle>
              <CardDescription>Next business day delivery</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-purple-600">$19.99</div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Next Business Day
              </Badge>
              <p className="text-sm text-gray-600">Order by 2 PM for next day</p>
            </CardContent>
          </Card>
        </div>

        {/* Free Shipping Banner */}
        <Card className="mb-12 bg-gradient-to-r from-green-500 to-blue-500 text-white border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-100" />
            <h3 className="text-2xl font-bold mb-2">Free Standard Shipping</h3>
            <p className="text-lg text-green-100 mb-4">
              On all orders over $50 within the continental United States
            </p>
            <Button variant="secondary" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Shipping Zones */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Globe className="h-6 w-6" />
              <span>Shipping Zones & Rates</span>
            </CardTitle>
            <CardDescription className="text-lg">
              We ship to various locations with different rates and timeframes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Zone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Standard</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Express</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Overnight</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Free Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Continental US</td>
                    <td className="py-3 px-4">$4.99 (3-5 days)</td>
                    <td className="py-3 px-4">$9.99 (1-2 days)</td>
                    <td className="py-3 px-4">$19.99 (Next day)</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Orders $50+</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Alaska & Hawaii</td>
                    <td className="py-3 px-4">$12.99 (5-7 days)</td>
                    <td className="py-3 px-4">$24.99 (2-3 days)</td>
                    <td className="py-3 px-4">$39.99 (1-2 days)</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Orders $75+</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Canada</td>
                    <td className="py-3 px-4">$15.99 (7-10 days)</td>
                    <td className="py-3 px-4">$29.99 (3-5 days)</td>
                    <td className="py-3 px-4">Not Available</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Orders $100+</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="text-2xl font-bold text-gray-900">Order Processing</CardTitle>
            <CardDescription className="text-lg">
              Understanding processing times for different order types
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  <span>Standard Orders</span>
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Processing Time:</strong> 1-2 business days</li>
                  <li>• <strong>Cut-off Time:</strong> 2:00 PM EST for same-day processing</li>
                  <li>• <strong>Weekend Orders:</strong> Processed on next business day</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Custom/Personalized Orders</span>
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>Processing Time:</strong> 3-5 business days</li>
                  <li>• <strong>Design Approval:</strong> Additional 1-2 days if needed</li>
                  <li>• <strong>Rush Service:</strong> Available for additional fee</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Important Notes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Processing times don&apos;t include shipping transit time</li>
                <li>• Holiday periods may extend processing times</li>
                <li>• You&apos;ll receive tracking information once your order ships</li>
                <li>• Custom orders require design approval before processing begins</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Information */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-2xl font-bold text-gray-900">Order Tracking</CardTitle>
            <CardDescription className="text-lg">
              Stay updated on your order&apos;s journey
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <p className="text-gray-700">
                Once your order is shipped, you&apos;ll receive an email with tracking information. 
                You can also track your order through your account dashboard.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Tracking Methods:</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Email notifications with tracking links</li>
                    <li>• Account dashboard order history</li>
                    <li>• SMS updates (optional)</li>
                    <li>• Carrier websites (UPS, FedEx, USPS)</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Order Status Updates:</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Order Confirmed</li>
                    <li>• Processing</li>
                    <li>• Shipped</li>
                    <li>• Out for Delivery</li>
                    <li>• Delivered</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="/orders">Track My Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-2xl font-bold text-gray-900">Shipping FAQ</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change my shipping address after placing an order?</h4>
                <p className="text-gray-700 text-sm">
                  Yes, but only if your order hasn&apos;t been processed yet. Contact us immediately to make changes.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What happens if I&apos;m not home for delivery?</h4>
                <p className="text-gray-700 text-sm">
                  The carrier will leave a notice and attempt redelivery. You can also arrange pickup at a nearby location.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you ship to PO Boxes?</h4>
                <p className="text-gray-700 text-sm">
                  Yes, we ship to PO Boxes using USPS. However, express and overnight options may not be available.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What if my package is damaged or lost?</h4>
                <p className="text-gray-700 text-sm">
                  Contact us immediately. We&apos;ll work with the carrier to resolve the issue and ensure you receive your order.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild>
                <Link href="/faq">View All FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}