"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { CategoryWithChildren } from "@/types/category";

export function CategoryMegaMenu() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch categories");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex border border-gray-300 dark:border-gray-600">
        <Link
          href="/products"
          className="flex-1 px-4 py-2 text-sm font-medium text-center bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-r border-gray-300 dark:border-gray-600"
        >
          ALL PRODUCTS
        </Link>
      </div>
    );
  }

  const allCategories = [
    { id: "all", name: "ALL PRODUCTS", slug: "products", children: [] },
    ...categories,
  ];

  return (
    <div className="w-full flex border border-gray-300 dark:border-gray-600">
      {allCategories.map((category, index) => (
        <div key={category.id} className="flex-1">
          {category.children && category.children.length > 0 ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "w-full h-auto px-4 py-2 text-sm font-medium text-center bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-none border-0",
                      index < allCategories.length - 1 &&
                        "border-r border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-slate-900 shadow-lg rounded-lg">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={`/categories/${category.slug}`}
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {category.name}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Browse all {category.name.toLowerCase()}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      {category.children.map((subcategory) => (
                        <ListItem
                          key={subcategory.id}
                          href={`/categories/${subcategory.slug}`}
                          title={subcategory.name}
                        />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Link
              href={
                category.id === "all"
                  ? "/products"
                  : `/categories/${category.slug}`
              }
              className={cn(
                "block w-full px-4 py-2 text-sm font-medium text-center bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors",
                index < allCategories.length - 1 &&
                  "border-r border-gray-300 dark:border-gray-600"
              )}
            >
              {category.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListItem = ({ className, title, children, href, ...props }: any) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  );
};
