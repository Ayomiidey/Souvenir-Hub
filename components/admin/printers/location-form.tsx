"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface State {
  id: string;
  name: string;
}

export function LocationForm() {
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    const res = await fetch("/api/admin/states");
    const data = await res.json();
    setStates(data.states || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stateId }),
      });
      if (res.ok) {
        toast.success("Location added!");
        setName("");
        setStateId("");
      } else {
        toast.error("Failed to add location");
      }
    } catch {
      toast.error("Error adding location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={stateId} onValueChange={setStateId}>
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
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Location name"
            required
          />
        </CardContent>
      </Card>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Location"}
      </Button>
    </form>
  );
}
