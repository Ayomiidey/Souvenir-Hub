"use client";

import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available for 1-2 business days delivery."
      },
      {
        question: "Can I track my order?",
        answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status in your account dashboard."
      },
      {
        question: "Do you ship internationally?",
        answer: "We currently ship to the United States and Canada. International shipping to other countries is coming soon."
      },
      {
        question: "What are your shipping costs?",
        answer: "Shipping costs vary based on location and order size. Free shipping is available on orders over $50 within the US."
      }
    ]
  },
  {
    category: "Products & Customization",
    questions: [
      {
        question: "Can I customize my souvenirs?",
        answer: "Absolutely! Most of our products can be customized with text, images, or logos. Look for the 'Customize' option on product pages."
      },
      {
        question: "What file formats do you accept for custom designs?",
        answer: "We accept PNG, JPG, PDF, and SVG files. For best results, use high-resolution images (300 DPI or higher)."
      },
      {
        question: "How long does customization take?",
        answer: "Custom orders typically take 2-3 additional business days to process before shipping."
      },
      {
        question: "Do you offer bulk discounts?",
        answer: "Yes! We offer discounts for orders of 50+ items. Contact us for a custom quote on bulk orders."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unused items in original condition. Custom items are final sale unless defective."
      },
      {
        question: "How do I return an item?",
        answer: "Log into your account, go to Order History, and select 'Return Item'. We'll provide a prepaid return label."
      },
      {
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 3-5 business days after we receive your returned item."
      },
      {
        question: "Can I exchange an item for a different size or color?",
        answer: "Yes, exchanges are available for non-custom items within 30 days of purchase."
      }
    ]
  },
  {
    category: "Account & Payment",
    questions: [
      {
        question: "Do I need an account to place an order?",
        answer: "While you can checkout as a guest, creating an account allows you to track orders, save favorites, and access exclusive deals."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details."
      },
      {
        question: "Can I save my payment information?",
        answer: "Yes, you can securely save payment methods to your account for faster checkout in the future."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">{question}</span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-6">
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Contact Card */}
        <Card className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span>Still have questions?</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/contact" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+15551234567" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, faqIndex) => (
                    <FAQItem
                      key={faqIndex}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
            <p className="text-blue-100 mb-6">
              Our customer service team is available Monday through Friday, 9 AM to 6 PM EST
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" asChild>
                <a href="/contact">Send us a Message</a>
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <a href="mailto:info@souvenirshop.com">Email Support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}