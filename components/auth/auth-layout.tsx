"use client";

import type React from "react";

import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  linkLabel: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Gift className="h-10 w-10 text-white drop-shadow-lg" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              SouvenirHub
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <Sparkles className="h-16 w-16 text-white/80 mb-4 animate-pulse" />
            <h1 className="text-4xl font-extrabold leading-tight text-center drop-shadow-lg">
              Discover Unique Gifts &amp; Custom Souvenirs
            </h1>
            <p className="text-lg text-purple-100 max-w-md text-center">
              Shop, personalize, and cherish. Join our creative community and
              find the perfect keepsake for every occasion.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-purple-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,200+</div>
                <div className="text-purple-200">Unique Products</div>
              </div>
            </div>
          </div>
          <div className="text-purple-200 mt-12 text-xs">
            © 2025 SouvenirHub. Crafted with love for memories that last.
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white/80 to-blue-50 dark:from-slate-900/80 dark:to-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-2 text-blue-700">
            <Gift className="h-8 w-8" />
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
              SouvenirHub
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {subtitle}{" "}
              <Link
                href={linkHref}
                className="font-medium text-blue-600 hover:text-purple-600 transition-colors"
              >
                {linkText}
              </Link>
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 py-8 px-6 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-md">
            {children}
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-purple-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-purple-600"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
