import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "@/types/carousel";

interface CarouselFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
}

export default function CarouselForm({
  register,
  errors,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting,
}: CarouselFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Title
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
            placeholder="Enter carousel title..."
          />
          {errors.title && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            Image URL
          </label>
          <input
            type="url"
            {...register("imageUrl")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
            Link (optional)
          </label>
          <input
            type="url"
            {...register("link")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
            placeholder="https://example.com/page"
          />
          {errors.link && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.link.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
            Type
          </label>
          <select
            {...register("type")}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <option value="homepage">Homepage</option>
            <option value="otherpage">Other Page</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.type.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Start Date
          </label>
          <input
            type="datetime-local"
            {...register("startDate", {
              setValueAs: (value) =>
                value ? new Date(value).toISOString() : "",
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            End Date
          </label>
          <input
            type="datetime-local"
            {...register("endDate", {
              setValueAs: (value) =>
                value ? new Date(value).toISOString() : "",
            })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.endDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            Sort Order
          </label>
          <input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
            placeholder="0"
          />
          {errors.sortOrder && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.sortOrder.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
          />
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            Active
          </label>
          {errors.isActive && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.isActive.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
          Description
        </label>
        <textarea
          {...register("description")}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white resize-none"
          rows={4}
          placeholder="Enter carousel description..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <span>{isEditing ? "Update" : "Create"} Carousel Item</span>
            </>
          )}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
