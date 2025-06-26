"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Sprout } from "lucide-react";

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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <Image
          src="/images/farm.jpg"
          alt="Farmer working in field"
          fill
          className="object-cover"
          priority
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8" />
            <span className="text-2xl font-bold">FAM 8</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Cultivating Success,
              <br />
              Growing Together
            </h1>
            <p className="text-xl text-emerald-100 max-w-md">
              Empowering farmers, investors, and communities through innovative
              land investment opportunities.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-emerald-200">Active Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50M+</div>
                <div className="text-emerald-200">Acres Managed</div>
              </div>
            </div>
          </div>

          <div className="text-emerald-200">
            © 2025 FAM 8. Empowering agriculture through technology.
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-2 text-emerald-600">
            <Sprout className="h-8 w-8" />
            <span className="text-2xl font-bold">FAM 8</span>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">
              {subtitle}{" "}
              <Link
                href={linkHref}
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                {linkText}
              </Link>
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-200">
            {children}
          </div>

          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
