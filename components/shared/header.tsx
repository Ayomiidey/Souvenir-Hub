"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CategoryWithChildren } from "@/types/category";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { CategoryMegaMenu } from "./category-mega-menu";
import { toast } from "sonner";

export function Header() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const wishlistItemCount = useAppSelector(
    (state) => state.wishlist.items.length
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Category fetching for mobile menu
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
        } else {
          setCategories([]);
        }
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(headerSearchQuery.trim())}`
      );
      setIsMobileSearchOpen(false);
      setHeaderSearchQuery("");
    }
  };

  const handleSearchInputChange = (value: string) => {
    setHeaderSearchQuery(value);
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    const loadingToast = toast.loading("Signing you out...", {
      description: "Please wait while we sign you out",
    });

    try {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });

      toast.dismiss(loadingToast);
      toast.success("Signed out successfully", {
        description: "You have been signed out of your account",
        duration: 3000,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.dismiss(loadingToast);
      toast.error("Sign out failed", {
        description: "Unable to sign out. Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/95 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/95 shadow-sm">
      {/* Top Row - Logo and Action Icons */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section - Mobile Menu + Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] sm:w-[320px] bg-white dark:bg-slate-900 shadow-xl p-0"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Link
                      href="/"
                      className="flex items-center space-x-2 mb-4"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ClassySouvenir
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  <div className="flex flex-col space-y-1">
                    <Link
                      href="/products"
                      className="text-sm font-medium py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Products
                    </Link>
                    {loadingCategories ? (
                      <span className="text-xs text-muted-foreground px-2 py-2">
                        Loading categories...
                      </span>
                    ) : (
                      categories.map((category) => (
                        <div key={category.id} className="mb-2 last:mb-0">
                          {category.children && category.children.length > 0 ? (
                            <details className="group">
                              <summary className="flex items-center justify-between cursor-pointer py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                                <span>{category.name}</span>
                                <ChevronDown className="h-4 w-4 ml-2 group-open:rotate-180 transition-transform" />
                              </summary>
                              <div className="ml-4 flex flex-col">
                                <Link
                                  href={`/categories/${category.slug}`}
                                  className="py-2 px-2 text-xs font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  Browse all {category.name.toLowerCase()}
                                </Link>
                                {category.children.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    href={`/categories/${sub.slug}`}
                                    className="py-2 px-2 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </details>
                          ) : (
                            <Link
                              href={`/categories/${category.slug}`}
                              className="text-sm font-medium py-3 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-base sm:text-lg lg:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ClassySouvenir
              </span>
            </Link>
          </div>

          {/* Right Section - Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              {isMobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle search</span>
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => dispatch(toggleWishlist())}
            >
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center min-w-[20px] bg-gradient-to-r from-pink-500 to-red-500"
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
              className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => dispatch(toggleCart())}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center min-w-[20px] bg-gradient-to-r from-green-500 to-blue-500"
                >
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
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
                    {session.user?.roles?.includes("ADMIN") && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/sign-in" className="cursor-pointer">
                        Sign in
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sign-up" className="cursor-pointer">
                        Sign up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Middle Row - Desktop Navigation Categories */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryMegaMenu />
        </div>
      </div>

      {/* Bottom Row - Desktop Search Bar */}
      <div className="hidden sm:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 w-[300px] lg:w-[400px] xl:w-[500px] h-10 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={headerSearchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-10 px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 sm:hidden">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full h-10 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={headerSearchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                autoFocus
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-10 px-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
