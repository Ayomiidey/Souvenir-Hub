// components/Footer.tsx
// Dynamic footer component that fetches data from the API and renders Quick Links with selected categories

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Type definition for footer data, including categories
type FooterData = {
  companyTitle: string;
  companyDescription: string;
  socialLinks: { platform: string; href: string }[];
  customerServiceTitle: string;
  customerServiceLinks: { text: string; href: string }[];
  contactTitle: string;
  contacts: { icon: string; text: string; href?: string }[];
  copyright: string;
  categories: { id: string; name: string; slug: string }[];
};

// Map social media platforms to their icons
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
  };

// Map contact icons
const contactIconMap: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
};

export function Footer() {
  const [data, setData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch footer data on mount
  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch("/api/footer");
        if (res.ok) {
          const footerData = await res.json();
          setData(footerData);
        } else {
          setError("Failed to load footer data");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch footer data");
      } finally {
        setLoading(false);
      }
    }
    fetchFooter();
  }, []);

  if (loading) {
    return (
      <footer className="bg-muted/50 border-t">
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </footer>
    );
  }

  if (error || !data) {
    return (
      <footer className="bg-muted/50 border-t">
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 SouvenirShop. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

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
          {/* Show first 2 categories on mobile if available */}
          {data.categories.slice(0, 2).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="font-medium text-primary hover:underline"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <p className="w-full text-center">{data.copyright}</p>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block px-4 py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{data.companyTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {data.companyDescription}
            </p>
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {data.socialLinks.map((link, index) => {
                  const Icon = iconMap[link.platform];
                  if (!Icon) return null;

                  return (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              {data.categories && data.categories.length > 0 ? (
                data.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/categories"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Browse Categories
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {data.customerServiceTitle}
            </h3>
            <ul className="space-y-2 text-sm">
              {data.customerServiceLinks.map((link, index) => {
                // Ensure internal links start with '/' for absolute paths
                const href = link.href.startsWith('http') 
                  ? link.href 
                  : link.href.startsWith('/') 
                    ? link.href 
                    : `/${link.href}`;
                
                return (
                  <li key={index}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{data.contactTitle}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {data.contacts.map((contact, index) => {
                const Icon = contactIconMap[contact.icon];
                if (!Icon) return null;

                const content = (
                  <div className="flex items-center space-x-2 hover:text-foreground transition-colors">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">{contact.text}</span>
                  </div>
                );

                return contact.href ? (
                  <Link
                    key={index}
                    href={contact.href.startsWith('http') || contact.href.startsWith('mailto:') || contact.href.startsWith('tel:')
                      ? contact.href 
                      : contact.href.startsWith('/') 
                        ? contact.href 
                        : `/${contact.href}`}
                    className="block hover:underline"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
