"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      const res = await fetch("/api/admin/states?limit=1000");
      const data = await res.json();
      console.log("Fetched states:", data.states?.length, "states");
      setStates(data.states || []);
    } catch (error) {
      console.error("Error fetching states:", error);
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
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("State added successfully");
        setNewState("");
        fetchStates();
      } else {
        // Show the specific error message from the API
        toast.error(data.error || "Failed to add state");
      }
    } catch (error) {
      console.error("Error adding state:", error);
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
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Location added successfully");
        setNewLocation({ name: "", stateId: "" });
        fetchStates();
      } else {
        // Show the specific error message from the API
        toast.error(data.error || "Failed to add location");
      }
    } catch (error) {
      console.error("Error adding location:", error);
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            States & Locations Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your geographical data with ease
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">
                {states.length} {states.length === 1 ? "State" : "States"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">
                {getTotalLocations()}{" "}
                {getTotalLocations() === 1 ? "Location" : "Locations"}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-100/50 shadow-sm mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full"></div>
              Search & Filter
            </h2>
            <p className="text-gray-600 text-sm">
              Find states and locations quickly
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search states or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Add Forms Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100/50 shadow-sm mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
              Add New Entries
            </h2>
            <p className="text-gray-600 text-sm">
              Create new states and locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add State Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New State</h3>
                  <p className="text-sm text-gray-600">Create a new state</p>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Enter state name"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleAddState()}
                />
                <Button
                  onClick={handleAddState}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
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
            </div>

            {/* Add Location Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New Location</h3>
                  <p className="text-sm text-gray-600">Create a new location</p>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="Enter location name"
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation((l) => ({ ...l, name: e.target.value }))
                  }
                  className="bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <select
                  value={newLocation.stateId}
                  onChange={(e) =>
                    setNewLocation((l) => ({ ...l, stateId: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50/50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
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
            </div>
          </div>
        </div>

        {/* States List Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              All States & Locations ({filteredStates.length})
            </h2>
            <p className="text-gray-600 text-sm">
              Manage existing states and their locations
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="space-y-4">
              {filteredStates.map((state) => (
                <div
                  key={state.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* State Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          {editingStateId === state.id ? (
                            <div className="flex items-center gap-3">
                              <Input
                                value={editingStateName}
                                onChange={(e) => setEditingStateName(e.target.value)}
                                className="text-lg font-semibold bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === "Enter" && handleEditState(state.id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleEditState(state.id)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                                disabled={actionLoading === `edit-state-${state.id}`}
                              >
                                {actionLoading === `edit-state-${state.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingStateId(null);
                                  setEditingStateName("");
                                }}
                                className="bg-white/80 hover:bg-white border-gray-200"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{state.name}</h3>
                              <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
                                {state.locations?.length || 0} {(state.locations?.length || 0) === 1 ? "location" : "locations"}
                              </Badge>
                            </div>
                          )}
                        </div>
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
                            className="bg-white/80 hover:bg-white border-gray-200 text-blue-600 hover:text-blue-700 hover:border-blue-300"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteState(state.id)}
                            disabled={actionLoading === `delete-state-${state.id}`}
                            className="bg-white/80 hover:bg-white border-gray-200 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            {actionLoading === `delete-state-${state.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="p-6">
                    {state.locations && state.locations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {state.locations.map((location) => (
                          <div
                            key={location.id}
                            className="bg-gray-50/50 rounded-lg p-4 hover:bg-gray-100/50 transition-colors border border-gray-100"
                          >
                            {editingLocation && editingLocation.id === location.id ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-green-500" />
                                  <Input
                                    value={editingLocation.name}
                                    onChange={(e) =>
                                      setEditingLocation((l) =>
                                        l ? { ...l, name: e.target.value } : null
                                      )
                                    }
                                    className="text-sm bg-white/80 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === "Enter" && handleEditLocation()}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={handleEditLocation}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                                    disabled={actionLoading === `edit-location-${location.id}`}
                                  >
                                    {actionLoading === `edit-location-${location.id}` ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Save className="w-3 h-3" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingLocation(null)}
                                    className="bg-white/80 hover:bg-white border-gray-200"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="font-medium text-gray-900">{location.name}</span>
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
                                    className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteLocation(location.id)}
                                    disabled={actionLoading === `delete-location-${location.id}`}
                                    className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                                  >
                                    {actionLoading === `delete-location-${location.id}` ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No locations in this state yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredStates.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? "No states or locations match your search." : "No states found."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
