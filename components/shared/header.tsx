"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { setSearch } from "@/store/slices/filtersSlice";
import { CategoryMegaMenu } from "./category-mega-menu";

export function Header() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const wishlistItemCount = useAppSelector(
    (state) => state.wishlist.items.length
  );
  const searchQuery = useAppSelector((state) => state.filters.search);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be handled by the products page
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-bold text-xl">SouvenirShop</span>
              </Link>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/products"
                  className="text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  href="/categories/t-shirts-apparel"
                  className="text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  T-Shirts & Apparel
                </Link>
                <Link
                  href="/categories/mugs-drinkware"
                  className="text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mugs & Drinkware
                </Link>
                <Link
                  href="/categories/home-decor"
                  className="text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home Decor
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block text-xl">
            SouvenirShop
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <CategoryMegaMenu />
        </nav>

        {/* Search Bar */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center space-x-2"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
            </div>
          </form>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => dispatch(toggleWishlist())}
          >
            <Heart className="h-5 w-5" />
            {wishlistItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {wishlistItemCount}
              </Badge>
            )}
            <span className="sr-only">Wishlist</span>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => dispatch(toggleCart())}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session ? (
                <>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  {session.user?.roles?.includes("ADMIN") && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup">Sign up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
