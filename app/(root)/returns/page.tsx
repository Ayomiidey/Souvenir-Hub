import { ArrowLeft, Package, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Easy returns and hassle-free exchanges within 30 days
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <span>Start a Return</span>
              </CardTitle>
              <CardDescription>
                Return items you&apos;re not satisfied with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/orders">View My Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <span>Exchange an Item</span>
              </CardTitle>
              <CardDescription>
                Exchange for different size or color
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Return Policy */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">Our Return Policy</CardTitle>
            <CardDescription className="text-lg">
              We want you to be completely satisfied with your purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">30 Day Window</h3>
                <p className="text-gray-600 text-sm">Returns accepted within 30 days of purchase</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Original Condition</h3>
                <p className="text-gray-600 text-sm">Items must be unused and in original packaging</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Returns</h3>
                <p className="text-gray-600 text-sm">We provide prepaid return labels</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">What&apos;s Returnable?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Eligible for Return
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Standard products in original condition</li>
                    <li>• Items with manufacturing defects</li>
                    <li>• Wrong items shipped</li>
                    <li>• Damaged items during shipping</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-700 mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Not Eligible for Return
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Custom printed/personalized items</li>
                    <li>• Items damaged by customer</li>
                    <li>• Items returned after 30 days</li>
                    <li>• Sale/clearance items (final sale)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-900">How to Return an Item</CardTitle>
            <CardDescription className="text-lg">
              Simple steps to process your return
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Badge className="bg-blue-600 text-white min-w-[2rem] h-8 flex items-center justify-center">1</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Log into Your Account</h4>
                  <p className="text-gray-600">Go to your order history and find the item you want to return.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Badge className="bg-blue-600 text-white min-w-[2rem] h-8 flex items-center justify-center">2</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Request Return</h4>
                  <p className="text-gray-600">Click &quot;Return Item&quot; and select your reason for returning.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Badge className="bg-blue-600 text-white min-w-[2rem] h-8 flex items-center justify-center">3</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Print Return Label</h4>
                  <p className="text-gray-600">We&apos;ll email you a prepaid return shipping label.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Badge className="bg-blue-600 text-white min-w-[2rem] h-8 flex items-center justify-center">4</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Package & Ship</h4>
                  <p className="text-gray-600">Package the item securely and drop it off at any authorized location.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Badge className="bg-green-600 text-white min-w-[2rem] h-8 flex items-center justify-center">5</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900">Get Your Refund</h4>
                  <p className="text-gray-600">Once we receive your item, your refund will be processed within 3-5 business days.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Information */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-2xl font-bold text-gray-900">Exchanges</CardTitle>
            <CardDescription className="text-lg">
              Need a different size or color? We&apos;ve got you covered
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              <p className="text-gray-700">
                Exchanges are available for non-custom items within 30 days of purchase. 
                Simply contact our customer service team to arrange an exchange.
              </p>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Exchange Process:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Contact us with your order number and desired exchange</li>
                  <li>• We&apos;ll check availability and provide exchange instructions</li>
                  <li>• Ship the original item back using our prepaid label</li>
                  <li>• Your new item will be shipped once we receive the original</li>
                </ul>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="/contact">Request Exchange</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-blue-100 mb-6">
              Our customer service team is here to help with any questions about returns or exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" asChild>
                <Link href="/contact" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Contact Support</span>
                </Link>
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/faq">Browse FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}