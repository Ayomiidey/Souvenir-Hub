"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  // Settings,
  // BarChart3,
  // FileText,
  ChevronLeft,
  ChevronRight,
  Store,
  ImagePlus,
} from "lucide-react";

const navigation = [
  {
    name: "Printers",
    href: "/admin/printers",
    icon: Package, // You can use a more printer-specific icon if available
  },
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/new" },
      // { name: "Import Products", href: "/admin/products/import" },
      // { name: "Export Products", href: "/admin/products/export" },
    ],
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    children: [
      { name: "All Categories", href: "/admin/categories" },
      { name: "Add Category", href: "/admin/categories/new" },
    ],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    children: [
      { name: "All Orders", href: "/admin/orders" },
      { name: "Pending Orders", href: "/admin/orders?status=pending" },
      { name: "Processing", href: "/admin/orders?status=processing" },
      { name: "Shipped", href: "/admin/orders?status=shipped" },
    ],
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: ImagePlus,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  // {
  //   name: "Analytics",
  //   href: "/admin/analytics",
  //   icon: BarChart3,
  //   children: [
  //     { name: "Sales Report", href: "/admin/analytics/sales" },
  //     { name: "Product Performance", href: "/admin/analytics/products" },
  //     { name: "Customer Insights", href: "/admin/analytics/customers" },
  //   ],
  // },
  // {
  //   name: "Reports",
  //   href: "/admin/reports",
  //   icon: FileText,
  //   children: [
  //     { name: "Sales Reports", href: "/admin/reports/sales" },
  //     { name: "Inventory Reports", href: "/admin/reports/inventory" },
  //     { name: "Customer Reports", href: "/admin/reports/customers" },
  //   ],
  // },
  // {
  //   name: "Settings",
  //   href: "/admin/settings",
  //   icon: Settings,
  //   children: [
  //     { name: "General", href: "/admin/settings" },
  //     { name: "Payment", href: "/admin/settings/payment" },
  //     { name: "Shipping", href: "/admin/settings/shipping" },
  //     { name: "Email", href: "/admin/settings/email" },
  //   ],
  // },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "bg-background border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname.startsWith(item.href) && "bg-muted"
                    )}
                    onClick={() => !collapsed && toggleExpanded(item.name)}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span className="ml-2">{item.name}</span>
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            expandedItems.includes(item.name) && "rotate-90"
                          )}
                        />
                      </>
                    )}
                  </Button>
                  {!collapsed && expandedItems.includes(item.name) && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-sm",
                            pathname === child.href && "bg-muted"
                          )}
                          asChild
                        >
                          <Link href={child.href}>{child.name}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-muted"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.name}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <Store className="h-4 w-4" />
            {!collapsed && <span className="ml-2">View Store</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
}
