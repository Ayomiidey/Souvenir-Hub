import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category && filters.category !== "all")
        params.set("category", filters.category);
      if (filters.status && filters.status !== "all")
        params.set("status", filters.status);
      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();
      const formattedProducts = (data.products || []).map((product: Product) => ({
        ...product,
        price: Number(product.price) || 0,
      }));
      setProducts(formattedProducts);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = (id: string) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-950 rounded-md shadow p-4 flex items-center gap-4 text-black">
        <span>Are you sure you want to delete this product?</span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await fetch(`/api/admin/products/${id}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  setProducts((prev) =>
                    prev.filter((product) => product.id !== id)
                  );
                  toast.success("Product deleted successfully!");
                } else {
                  const data = await response.json();
                  toast.error(data.message || "Failed to delete product");
                }
              } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Error deleting product");
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ));
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          Products ({products.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 mt-1"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          Products ({products.length})
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <MoreHorizontal className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first product</p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            <Link href="/admin/products/new">Add your first product</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0 mr-3">
                            <Image
                              src={product.images[0]?.url || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{product.sku}</div>
                            {product.isFeatured && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs mt-1">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">₦{product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.quantity}</div>
                        <div className="text-xs text-gray-500">{stockStatus.label}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  disabled={p === page}
                  className={p === page ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0" : "bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
