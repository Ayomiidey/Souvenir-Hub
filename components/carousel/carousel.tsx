"use client";

import { useEffect, useState } from "react";
import CarouselSlide from "./carousel-slide";
import CarouselArrows from "./carousel-arrow";
import CarouselDots from "./carousel-dots";

interface CarouselItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  type: "homepage" | "product" | "category";
  sortOrder: number;
}

interface CarouselProps {
  type: "homepage" | "product" | "category";
}

export default function Carousel({ type }: CarouselProps) {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/carousel");
        const data = await response.json();

        const filteredItems = data
          .filter(
            (item: CarouselItem) =>
              item.type === type &&
              item.isActive &&
              new Date(item.startDate) <= new Date() &&
              new Date(item.endDate) >= new Date()
          )
          .sort(
            (a: CarouselItem, b: CarouselItem) => a.sortOrder - b.sortOrder
          );

        setItems(filteredItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch carousel items:", error);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  // Auto-advance carousel
  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-red-500">
        No active carousel items
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <CarouselSlide
            key={item.id}
            item={item}
            isActive={index === currentIndex}
          />
        ))}
      </div>
      <CarouselArrows onPrevious={goToPrevious} onNext={goToNext} />
      <CarouselDots
        itemCount={items.length}
        currentIndex={currentIndex}
        onDotClick={goToSlide}
      />
    </div>
  );
}
