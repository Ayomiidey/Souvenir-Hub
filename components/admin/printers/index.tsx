"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Printer className="h-7 w-7 text-orange-600" />
        <h1 className="text-2xl font-bold">Manage Printers</h1>
        <Button className="ml-auto" onClick={handleCreate}>
          Add Printer
        </Button>
      </div>
      <Separator className="mb-6" />
      {showForm && (
        <PrinterForm
          printerId={editPrinter?.id}
          initialData={editPrinter}
          onClose={handleFormClose}
        />
      )}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div>Loading printers...</div>
          ) : printers.length === 0 ? (
            <div>No printers found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">State</th>
                  <th className="py-2">Location</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {printers.map((printer) => (
                  <tr key={printer.id} className="border-b">
                    <td className="py-2 font-medium">{printer.name}</td>
                    <td className="py-2">{printer.state?.name}</td>
                    <td className="py-2">{printer.location?.name}</td>
                    <td className="py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(printer)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
