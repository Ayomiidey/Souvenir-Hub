import { CarouselItem } from "@/types/carousel";

interface CarouselTableProps {
  items: CarouselItem[];
  onEdit: (item: CarouselItem) => void;
  onDelete: (id: string) => void;
}

export default function CarouselTable({
  items,
  onEdit,
  onDelete,
}: CarouselTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sort Order
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.title}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.type}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.sortOrder}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.isActive ? "Yes" : "No"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
