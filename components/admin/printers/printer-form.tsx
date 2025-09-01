/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { StateForm } from "./state-form";
import { LocationForm } from "./location-form";

interface State {
  id: string;
  name: string;
}
interface Location {
  id: string;
  name: string;
  stateId: string;
}

interface PrinterFormProps {
  printerId?: string;
  initialData?: any;
  onClose?: (refresh?: boolean) => void;
}

const PrinterForm: React.FC<PrinterFormProps> = ({
  printerId,
  initialData,
  onClose,
}) => {
  const [showStateForm, setShowStateForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState<any>(
    initialData || {
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      stateId: "",
      locationId: "",
      description: "",
      isActive: true,
    }
  );
  const [loading, setLoading] = useState(false);

  // Fetch states only on mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch locations when stateId changes
  useEffect(() => {
    if (formData.stateId) fetchLocations(formData.stateId);
    else setLocations([]);
  }, [formData.stateId]);

  const fetchStates = async () => {
    const res = await fetch("/api/admin/states");
    try {
      const data = await res.json();
      setStates(data.states || []);
    } catch {
      setStates([]);
    }
  };
  const fetchLocations = async (stateId: string) => {
    const res = await fetch(`/api/admin/locations?stateId=${stateId}`);
    try {
      const data = await res.json();
      setLocations(data.locations || []);
    } catch {
      setLocations([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = printerId
      ? `/api/admin/printers/${printerId}`
      : "/api/admin/printers";
    const method = printerId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(
          `Printer ${printerId ? "updated" : "created"} successfully!`
        );
        if (onClose) onClose(true);
      } else {
        toast.error("Failed to save printer");
      }
    } catch {
      toast.error("Error saving printer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline State Creation Modal */}
      {showStateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
            <StateForm />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStateForm(false);
                  fetchStates();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Inline Location Creation Modal */}
      {showLocationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
            <LocationForm />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLocationForm(false);
                  if (formData.stateId) fetchLocations(formData.stateId);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{printerId ? "Edit" : "Add"} Printer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Contact Person</Label>
              <Input
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>State</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowStateForm(true)}
                >
                  Add State
                </Button>
              </div>
              <Select
                value={formData.stateId}
                onValueChange={(val) =>
                  setFormData({ ...formData, stateId: val, locationId: "" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Location</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLocationForm(true)}
                  disabled={!formData.stateId}
                >
                  Add Location
                </Button>
              </div>
              <Select
                value={formData.locationId}
                onValueChange={(val) =>
                  setFormData({ ...formData, locationId: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={formData.isActive ? "active" : "inactive"}
                onValueChange={(val) =>
                  setFormData({ ...formData, isActive: val === "active" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : printerId
              ? "Update Printer"
              : "Create Printer"}
        </Button>
      </form>
    </>
  );
};

export default PrinterForm;
