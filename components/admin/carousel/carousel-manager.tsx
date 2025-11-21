"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import CarouselForm from "./carousel-form";
import CarouselTable from "./carousel-table";
import { CarouselItem } from "../../../types/carousel";
import { carouselSchema } from "@/lib/validations/carousel-schema";

type FormData = z.infer<typeof carouselSchema>;

export default function CarouselManager() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(carouselSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      link: "",
      description: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      isActive: true,
      type: "homepage",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/carousel");
      setItems(response.data);
      setError(null);
    } catch {
      setError("Failed to fetch carousel items");
      toast.error("Failed to fetch carousel items");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingId) {
        await axios.put(`/api/carousel/${editingId}`, data);
        toast.success("Carousel item updated successfully!");
      } else {
        await axios.post("/api/carousel", data);
        toast.success("Carousel item created successfully!");
      }
      reset();
      setEditingId(null);
      fetchItems();
      setError(null);
    } catch {
      setError("Failed to save carousel item");
      toast.error("Failed to save carousel item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: CarouselItem) => {
    setEditingId(item.id);
    setValue("title", item.title);
    setValue("imageUrl", item.imageUrl);
    setValue("link", item.link || "");
    setValue("description", item.description);
    // Format ISO strings to datetime-local format (e.g., 2025-06-13T00:00)
    setValue("startDate", new Date(item.startDate).toISOString().slice(0, 16));
    setValue("endDate", new Date(item.endDate).toISOString().slice(0, 16));
    setValue("isActive", item.isActive);
    setValue("type", item.type);
    setValue("sortOrder", item.sortOrder);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast("Are you sure you want to delete this carousel item?", {
        action: {
          label: "Delete",
          onClick: () => resolve(true),
        },
        cancel: {
          label: "Cancel",
          onClick: () => resolve(false),
        },
      });
    });

    if (!confirmed) return;

    try {
      await axios.delete(`/api/carousel/${id}`);
      fetchItems();
      setError(null);
      toast.success("Carousel item deleted successfully!");
    } catch {
      setError("Failed to delete carousel item");
      toast.error("Failed to delete carousel item");
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100/50 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          Create/Edit Carousel Item
        </h2>
        <CarouselForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          isEditing={!!editingId}
          isSubmitting={isSubmitting}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          Carousel Items ({items.length})
        </h2>
        <CarouselTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
