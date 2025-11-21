"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import PrinterForm from "./printer-form";

// Types
interface State {
  id: string;
  name: string;
}
interface Location {
  id: string;
  name: string;
  stateId: string;
}
interface PrinterType {
  id: string;
  name: string;
  stateId: string;
  locationId: string;
  state: State;
  location: Location;
}

export default function PrintersAdminPage() {
  const [printers, setPrinters] = useState<PrinterType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPrinter, setEditPrinter] = useState<PrinterType | null>(null);

  // Fetch printers
  const fetchPrinters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/printers");
      const data = await res.json();
      setPrinters(data);
    } catch {
      setPrinters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  const handleEdit = (printer: PrinterType) => {
    setEditPrinter(printer);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditPrinter(null);
    setShowForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setShowForm(false);
    setEditPrinter(null);
    if (refresh) fetchPrinters();
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Printer Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage printing services and locations
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              Printer Services
            </h2>
            <p className="text-gray-600 text-sm">Configure printing locations and services</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
          >
            <Printer className="h-4 w-4 mr-2" />
            Add Printer
          </Button>
        </div>

        {showForm && (
          <div className="mb-6">
            <PrinterForm
              printerId={editPrinter?.id}
              initialData={editPrinter}
              onClose={handleFormClose}
            />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : printers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Printer className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No printers configured</h3>
            <p className="text-gray-500 mb-4">Add your first printing service to get started</p>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            >
              <Printer className="h-4 w-4 mr-2" />
              Add Printer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {printers.map((printer) => (
              <div
                key={printer.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Printer className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {printer.name}
                    </h3>
                    <p className="text-sm text-gray-500">Printing Service</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">State</span>
                    <span className="text-sm font-medium text-gray-900">{printer.state?.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-medium text-gray-900">{printer.location?.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(printer)}
                    className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white transition-all duration-200"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
