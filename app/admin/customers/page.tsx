"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowLeft, User, Mail, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  ordersCount?: number;
  roles: string[];
}

export default function CustomerAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const roleOptions = ["USER", "ADMIN"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("Role updated");
        fetchUsers();
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      console.log("Error updating role:", err);
      toast.error("Error updating role");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-muted rounded shimmer"></div>
          <div className="h-8 bg-muted rounded shimmer w-48"></div>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded shimmer w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded shimmer"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Customer Management</h1>
        </div>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-4 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <User className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                      {user.phone && (
                        <>
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={user.roles[0] || "USER"}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0) + role.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No customers found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
