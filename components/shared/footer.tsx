import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      {/* Mobile Footer */}
      <div className="md:hidden py-6 px-4 text-center text-sm text-muted-foreground flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-2 w-full">
          <Link
            href="/products"
            className="font-medium text-primary hover:underline"
          >
            Products
          </Link>
          <Link
            href="/contact"
            className="font-medium text-primary hover:underline"
          >
            Contact Us
          </Link>
          <Link
            href="/faq"
            className="font-medium text-primary hover:underline"
          >
            FAQ
          </Link>
        </div>
        <p className="w-full text-center">
          &copy; 2024 SouvenirShop. All rights reserved.
        </p>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block px-4 py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SouvenirShop</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for custom souvenirs, personalized gifts, and
              unique memorabilia.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/t-shirts-apparel"
                  className="text-muted-foreground hover:text-foreground"
                >
                  T-Shirts & Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/mugs-drinkware"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Mugs & Drinkware
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/home-decor"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@souvenirshop.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Main St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SouvenirShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
