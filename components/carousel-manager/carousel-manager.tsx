"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import CarouselForm from "./carousel-form";
import CarouselTable from "./carousel-table";
import { CarouselItem } from "../../types/carousel";
import { carouselSchema } from "@/lib/validations/carousel-schema";

type FormData = z.infer<typeof carouselSchema>;

export default function CarouselManager() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const response = await axios.get("/api/carousel");
      setItems(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch carousel items");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingId) {
        await axios.put(`/api/carousel/${editingId}`, data);
      } else {
        await axios.post("/api/carousel", data);
      }
      reset();
      setEditingId(null);
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to save carousel item");
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
    try {
      await axios.delete(`/api/carousel/${id}`);
      fetchItems();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to delete carousel item");
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Carousel Manager</h1>
      <CarouselForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        isEditing={!!editingId}
      />
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      <CarouselTable
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
