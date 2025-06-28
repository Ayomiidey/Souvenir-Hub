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

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export function CategoryMegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories from API
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/products" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
              All Products
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            {category.children && category.children.length > 0 ? (
              <>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
              </>
            ) : (
              <Link
                href={`/categories/${category.slug}`}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  {category.name}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListItem = ({ className, title, children, href, ...props }: any) => {
  return (
    <li>
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
    </li>
  );
};
