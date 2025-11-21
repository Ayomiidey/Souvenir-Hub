import { CarouselItem } from "@/types/carousel";
import { Edit, Trash2, Eye, Calendar, Hash } from "lucide-react";
import Image from "next/image";

interface CarouselTableProps {
  items: CarouselItem[];
  onEdit: (item: CarouselItem) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const CarouselSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function CarouselTable({
  items,
  onEdit,
  onDelete,
  isLoading,
}: CarouselTableProps) {
  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Hash className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No carousel items yet</h3>
        <p className="text-gray-500">Create your first carousel item to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="w-3 h-3" />
                <span>Order: {item.sortOrder}</span>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {item.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          {item.imageUrl && (
            <div className="mb-4 relative">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={400}
                height={128}
                className="w-full h-32 object-cover rounded-lg bg-gray-100"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span className="capitalize">{item.type}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
