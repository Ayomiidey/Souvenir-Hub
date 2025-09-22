"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  MapPin,
  Globe,
  Search,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface State {
  id: string;
  name: string;
  locations: Location[];
}
interface Location {
  id: string;
  name: string;
  stateId: string;
}

export default function AdminStatesLocations() {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newState, setNewState] = useState("");
  const [editingStateId, setEditingStateId] = useState<string | null>(null);
  const [editingStateName, setEditingStateName] = useState("");
  const [newLocation, setNewLocation] = useState<{
    name: string;
    stateId: string;
  }>({ name: "", stateId: "" });
  const [editingLocation, setEditingLocation] = useState<{
    id: string;
    name: string;
    stateId: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch all states and locations
  const fetchStates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/states");
      const data = await res.json();
      setStates(data.states || []);
    } catch {
      toast.error("Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // Filter states based on search term
  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.locations?.some((loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // State CRUD
  const handleAddState = async () => {
    if (!newState.trim()) return;
    setActionLoading("add-state");
    try {
      const res = await fetch("/api/admin/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newState }),
      });
      if (res.ok) {
        toast.success("State added");
        setNewState("");
        fetchStates();
      } else {
        toast.error("Failed to add state");
      }
    } catch {
      toast.error("Failed to add state");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditState = async (id: string) => {
    if (!editingStateName.trim()) return;
    setActionLoading(`edit-state-${id}`);
    try {
      const res = await fetch(`/api/admin/states/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingStateName }),
      });
      if (res.ok) {
        toast.success("State updated");
        setEditingStateId(null);
        setEditingStateName("");
        fetchStates();
      } else {
        toast.error("Failed to update state");
      }
    } catch {
      toast.error("Failed to update state");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteState = async (id: string) => {
    const stateName = states.find((s) => s.id === id)?.name || "this state";

    toast(`Delete ${stateName}?`, {
      description:
        "This will also delete all locations in this state. This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          setActionLoading(`delete-state-${id}`);
          try {
            const res = await fetch(`/api/admin/states/${id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              toast.success("State deleted successfully");
              fetchStates();
            } else {
              toast.error("Failed to delete state");
            }
          } catch {
            toast.error("Failed to delete state");
          } finally {
            setActionLoading(null);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      style: {
        backgroundColor: "#fff",
        color: "#000",
      },
    });
  };

  // Location CRUD
  const handleAddLocation = async () => {
    if (!newLocation.name.trim() || !newLocation.stateId) return;
    setActionLoading("add-location");
    try {
      const res = await fetch(`/api/admin/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLocation.name,
          stateId: newLocation.stateId,
        }),
      });
      if (res.ok) {
        toast.success("Location added");
        setNewLocation({ name: "", stateId: "" });
        fetchStates();
      } else {
        toast.error("Failed to add location");
      }
    } catch {
      toast.error("Failed to add location");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditLocation = async () => {
    if (!editingLocation || !editingLocation.name.trim()) return;
    setActionLoading(`edit-location-${editingLocation.id}`);
    try {
      const res = await fetch(`/api/admin/locations/${editingLocation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingLocation.name }),
      });
      if (res.ok) {
        toast.success("Location updated");
        setEditingLocation(null);
        fetchStates();
      } else {
        toast.error("Failed to update location");
      }
    } catch {
      toast.error("Failed to update location");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    const location = states
      .flatMap((s) => s.locations || [])
      .find((l) => l.id === id);
    const locationName = location?.name || "this location";

    toast(`Delete ${locationName}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          setActionLoading(`delete-location-${id}`);
          try {
            const res = await fetch(`/api/admin/locations/${id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              toast.success("Location deleted successfully");
              fetchStates();
            } else {
              toast.error("Failed to delete location");
            }
          } catch {
            toast.error("Failed to delete location");
          } finally {
            setActionLoading(null);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      style: {
        backgroundColor: "#fff",
        color: "#000",
      },
    });
  };

  const getTotalLocations = () => {
    return states.reduce(
      (total, state) => total + (state.locations?.length || 0),
      0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            States & Locations Manager
          </h1>
          <p className="text-slate-600">
            Manage your geographical data with ease
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-600">
                {states.length} {states.length === 1 ? "State" : "States"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-600">
                {getTotalLocations()}{" "}
                {getTotalLocations() === 1 ? "Location" : "Locations"}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 shadow-md border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search states or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-slate-50/50 focus:bg-white transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Forms */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add State Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5" />
                  Add New State
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Enter state name"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                    onKeyPress={(e) => e.key === "Enter" && handleAddState()}
                  />
                  <Button
                    onClick={handleAddState}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    disabled={!newState.trim() || actionLoading === "add-state"}
                  >
                    {actionLoading === "add-state" ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add State
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Location Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  Add New Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Enter location name"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation((l) => ({ ...l, name: e.target.value }))
                    }
                    className="border-slate-200 focus:border-green-300 focus:ring-green-100"
                  />
                  <select
                    value={newLocation.stateId}
                    onChange={(e) =>
                      setNewLocation((l) => ({ ...l, stateId: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-md px-3 py-2 focus:border-green-300 focus:ring-green-100 bg-white"
                  >
                    <option value="">Select State</option>
                    {(states || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAddLocation}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    disabled={
                      !newLocation.name.trim() ||
                      !newLocation.stateId ||
                      actionLoading === "add-location"
                    }
                  >
                    {actionLoading === "add-location" ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - States List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                <CardTitle className="text-xl">
                  All States & Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    <span className="ml-2 text-slate-600">
                      Loading states...
                    </span>
                  </div>
                ) : filteredStates.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">
                      {searchTerm
                        ? "No states or locations match your search."
                        : "No states found."}
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredStates.map((state, index) => (
                      <div
                        key={state.id}
                        className={`p-6 transition-all duration-200 hover:bg-slate-50/50 ${
                          index !== filteredStates.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }`}
                      >
                        {/* State Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {editingStateId === state.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingStateName}
                                  onChange={(e) =>
                                    setEditingStateName(e.target.value)
                                  }
                                  className="text-lg font-semibold border-slate-200 focus:border-blue-300"
                                  onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    handleEditState(state.id)
                                  }
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleEditState(state.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                  disabled={
                                    actionLoading === `edit-state-${state.id}`
                                  }
                                >
                                  {actionLoading ===
                                  `edit-state-${state.id}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Save className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingStateId(null);
                                    setEditingStateName("");
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Globe className="w-5 h-5 text-blue-500" />
                                <h3 className="text-xl font-bold text-slate-800">
                                  {state.name}
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-700"
                                >
                                  {state.locations?.length || 0}{" "}
                                  {(state.locations?.length || 0) === 1
                                    ? "location"
                                    : "locations"}
                                </Badge>
                              </>
                            )}
                          </div>

                          {editingStateId !== state.id && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingStateId(state.id);
                                  setEditingStateName(state.name);
                                }}
                                className="hover:bg-blue-50 hover:border-blue-200"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteState(state.id)}
                                disabled={
                                  actionLoading === `delete-state-${state.id}`
                                }
                                className="hover:bg-red-600"
                              >
                                {actionLoading ===
                                `delete-state-${state.id}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Locations */}
                        <div className="ml-8">
                          {state.locations && state.locations.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {state.locations.map((location) => (
                                <div
                                  key={location.id}
                                  className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors"
                                >
                                  {editingLocation &&
                                  editingLocation.id === location.id ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <Input
                                        value={editingLocation.name}
                                        onChange={(e) =>
                                          setEditingLocation((l) =>
                                            l
                                              ? { ...l, name: e.target.value }
                                              : null
                                          )
                                        }
                                        className="text-sm border-slate-200 focus:border-green-300"
                                        onKeyPress={(e) =>
                                          e.key === "Enter" &&
                                          handleEditLocation()
                                        }
                                      />
                                      <Button
                                        size="sm"
                                        onClick={handleEditLocation}
                                        className="bg-green-500 hover:bg-green-600"
                                        disabled={
                                          actionLoading ===
                                          `edit-location-${location.id}`
                                        }
                                      >
                                        {actionLoading ===
                                        `edit-location-${location.id}` ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Save className="w-3 h-3" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingLocation(null)}
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        <span className="text-slate-700">
                                          {location.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            setEditingLocation({
                                              id: location.id,
                                              name: location.name,
                                              stateId: state.id,
                                            })
                                          }
                                          className="h-7 w-7 p-0 hover:bg-blue-100"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            handleDeleteLocation(location.id)
                                          }
                                          disabled={
                                            actionLoading ===
                                            `delete-location-${location.id}`
                                          }
                                          className="h-7 w-7 p-0 hover:bg-red-100"
                                        >
                                          {actionLoading ===
                                          `delete-location-${location.id}` ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <Trash2 className="w-3 h-3 text-red-500" />
                                          )}
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-slate-500 bg-slate-50/50 rounded-lg">
                              <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                              <p className="text-sm">
                                No locations in this state yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
