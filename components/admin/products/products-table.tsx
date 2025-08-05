/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Edit, Eye, Trash2, Copy } from "lucide-react";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  status: string;
  category: { name: string };
  images: { url: string; altText: string }[];
  createdAt: string;
  isFeatured: boolean;
  deliveryTime?: string;
}

interface ProductsTableProps {
  filters?: {
    search: string;
    category: string;
    status: string;
  };
}

export function ProductsTable({
  filters = { search: "", category: "all", status: "all" },
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category && filters.category !== "all")
        params.set("category", filters.category);
      if (filters.status && filters.status !== "all")
        params.set("status", filters.status);

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();
      const formattedProducts = (data.products || []).map((product: any) => ({
        ...product,
        price: Number(product.price) || 0,
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]); // Depend on filters to refetch when they change

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Depend on the memoized fetchProducts

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const confirm = await toast.promise(
      new Promise((resolve) => setTimeout(() => resolve(true), 100)), // Simulated confirm
      {
        loading: "Confirming deletion...",
        success: "Deletion confirmed",
        error: "Cancelled",
      },
      { position: "top-right", duration: 3000 }
    );

    if (confirm) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProducts(products.filter((product) => product.id !== id));
          toast.success("Product deleted successfully!");
        } else {
          const data = await response.json();
          toast.error(data.message || "Failed to delete product");
        }
      } catch (error) {
        toast.error("Error deleting product");
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `/api/admin/products/${productId}/duplicate`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Product duplicated successfully");
        fetchProducts();
      } else {
        toast.error("Failed to duplicate product");
      }
    } catch (error) {
      toast.error("Error duplicating product");
      console.log(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    } else if (quantity <= 5) {
      return { label: "Low Stock", color: "bg-orange-100 text-orange-800" };
    }
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-4 bg-muted rounded shimmer"></div>
                <div className="h-12 w-12 bg-muted rounded shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded shimmer w-48"></div>
                  <div className="h-3 bg-muted rounded shimmer w-32"></div>
                </div>
                <div className="h-6 bg-muted rounded shimmer w-16"></div>
                <div className="h-6 bg-muted rounded shimmer w-20"></div>
                <div className="h-8 w-8 bg-muted rounded shimmer"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === products.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.quantity);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={product.images[0]?.url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.isFeatured && (
                            <Badge variant="secondary" className="mr-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>₦{(product.price * 1600).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{product.quantity}</div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                      {product.deliveryTime && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {product.deliveryTime}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateProduct(product.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No products found</div>
            <Button className="mt-4" asChild>
              <Link href="/admin/products/new">Add your first product</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
