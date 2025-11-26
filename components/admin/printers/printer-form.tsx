"use client";
const emptyForm = {
  name: "",
  contact: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  stateId: "",
  locationId: "",
  description: "",
  isActive: true,
};
/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import { StateForm } from "./state-form";
// import { LocationForm } from "./location-form";

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
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState<any>(initialData || emptyForm);

    // Reset form when initialData changes (edit vs add)
    useEffect(() => {
      setFormData(initialData || emptyForm);
    }, [initialData]);
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
              <Label>WhatsApp (optional)</Label>
              <Input
                value={formData.whatsapp || ""}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                placeholder="WhatsApp number (optional)"
                disabled={loading}
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
                {/* Button removed */}
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
                {/* Button removed */}
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
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onClose && onClose(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : printerId
                ? "Update Printer"
                : "Create Printer"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PrinterForm;
