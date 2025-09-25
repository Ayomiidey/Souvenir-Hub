// components/Footer.tsx

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

type FooterData = {
  companyTitle: string;
  companyDescription: string;
  socialLinks: { platform: string; href: string }[];
  customerServiceTitle: string;
  customerServiceLinks: { text: string; href: string }[];
  contactTitle: string;
  contacts: { icon: string; text: string; href?: string }[];
  copyright: string;
};

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
  };

const contactIconMap: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
};

export function Footer() {
  const [data, setData] = useState<FooterData | null>(null);

  useEffect(() => {
    async function fetchFooter() {
      const res = await fetch("/api/footer");
      if (res.ok) {
        setData(await res.json());
      }
    }
    fetchFooter();
  }, []);

  if (!data) return null;

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
            <div className="flex space-x-4">
              {data.socialLinks.map((link, index) => {
                const Icon = iconMap[link.platform];
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links (static as per user request) */}
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
            <h3 className="text-lg font-semibold">
              {data.customerServiceTitle}
            </h3>
            <ul className="space-y-2 text-sm">
              {data.customerServiceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{data.contactTitle}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {data.contacts.map((contact, index) => {
                const Icon = contactIconMap[contact.icon];
                const content = (
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{contact.text}</span>
                  </div>
                );
                return contact.href ? (
                  <Link
                    key={index}
                    href={contact.href}
                    className="hover:underline"
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

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
