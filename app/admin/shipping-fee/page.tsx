
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

interface State {
	id: string;
	name: string;
}
interface Location {
	id: string;
	name: string;
	shippingFee: string | number | null;
	stateId: string;
}

export default function ShippingFeeAdminPage() {
	const [states, setStates] = useState<State[]>([]);
	const [locations, setLocations] = useState<Location[]>([]);
	const [selectedState, setSelectedState] = useState<string>("");
	const [tableFilterState, setTableFilterState] = useState<string>("");
	const [selectedLocation, setSelectedLocation] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [newState, setNewState] = useState({ name: "" });
	const [newLocation, setNewLocation] = useState({ name: "" });
	const [feeInput, setFeeInput] = useState<string>("");
	const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
	const [editingLocationName, setEditingLocationName] = useState<string>("");
	const [editingLocationFee, setEditingLocationFee] = useState<string>("");

	// Fetch all states
	useEffect(() => {
		fetch("/api/admin/states")
			.then((res) => res.json())
			.then((data) => setStates(Array.isArray(data) ? data : data.states || []))
			.catch(() => setStates([]));
	}, []);

	// Fetch locations for selected state (for dropdowns and table)
	// Fetch all locations for the table and dropdowns
	const fetchLocations = () => {
		setLoading(true);
		fetch(`/api/admin/locations`)
			.then((res) => res.json())
			.then((data) => setLocations(data.locations || []))
			.catch(() => setLocations([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchLocations();
	}, []);
	useEffect(() => {
		fetchLocations();
	}, [selectedState]);

	// Add new state
	const handleAddState = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newState.name.trim()) return;
		setLoading(true);
		const res = await fetch("/api/admin/states", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newState.name }),
		});
		setLoading(false);
		if (res.ok) {
			setNewState({ name: "" });
			toast.success("State added!");
			fetch("/api/admin/states")
				.then((res) => res.json())
				.then((data) => setStates(Array.isArray(data) ? data : data.states || []));
		} else {
			toast.error("Failed to add state");
		}
	};

	// Add new location
	const handleAddLocation = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newLocation.name.trim() || !selectedState) return;
		setLoading(true);
		const res = await fetch("/api/admin/locations", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newLocation.name, stateId: selectedState }),
		});
		setLoading(false);
		if (res.ok) {
			setNewLocation({ name: "" });
			toast.success("Location added!");
			fetchLocations();
		} else {
			toast.error("Failed to add location");
		}
	};

	// Edit location
	const handleEditLocation = (loc: Location) => {
		setEditingLocationId(loc.id);
		setEditingLocationName(loc.name);
		setEditingLocationFee(loc.shippingFee?.toString() || "");
	};
	const handleSaveEditLocation = async (locId: string) => {
		setLoading(true);
		const res = await fetch(`/api/admin/locations/${locId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: editingLocationName, shippingFee: Number(editingLocationFee) }),
		});
		setLoading(false);
		if (res.ok) {
			setEditingLocationId(null);
			setEditingLocationName("");
			setEditingLocationFee("");
			toast.success("Location updated!");
			fetchLocations();
		} else {
			toast.error("Failed to update location");
		}
	};
	// Delete location
	const handleDeleteLocation = async (locId: string) => {
		if (!window.confirm("Are you sure you want to delete this location?")) return;
		setLoading(true);
		const res = await fetch(`/api/admin/locations/${locId}`, { method: "DELETE" });
		setLoading(false);
		if (res.ok) {
			toast.success("Location deleted!");
			fetchLocations();
		} else {
			toast.error("Failed to delete location");
		}
	};

	// Save shipping fee for a location
	const handleSaveFee = async () => {
		if (!selectedLocation || !feeInput) return;
		setLoading(true);
		const res = await fetch(`/api/admin/locations/${selectedLocation}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ shippingFee: Number(feeInput) }),
		});
		setLoading(false);
		if (res.ok) {
			toast.success("Shipping fee updated!");
			setFeeInput("");
			fetchLocations();
		} else {
			toast.error("Failed to update shipping fee");
		}
	};

	return (
		<div className="max-w-5xl mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Shipping Fee Management</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Section 1: Add State */}
					<div className="mb-2 mt-2">
						<h2 className="text-lg font-bold mb-2">Add State</h2>
						<form onSubmit={handleAddState} className="flex gap-2 items-end">
							<div className="flex-1">
								<Label htmlFor="newState">State Name</Label>
								<Input
									id="newState"
									value={newState.name}
									onChange={(e) => setNewState({ name: e.target.value })}
									placeholder="State name"
									required
								/>
							</div>
							<Button type="submit" disabled={loading} className="h-10">
								Add
							</Button>
						</form>
					</div>

					{/* Section 2: Add Location */}
					<div className="mb-6 mt-6">
						<h2 className="text-lg font-bold mb-2">Add Location</h2>
						<form onSubmit={handleAddLocation} className="flex gap-2 items-end">
							<div className="flex-1">
								<Label htmlFor="addLocationState">State</Label>
								<select
									id="addLocationState"
									className="w-full border rounded px-3 py-2 mt-1"
									value={selectedState}
									onChange={(e) => setSelectedState(e.target.value)}
									required
								>
									<option value="">-- Select State --</option>
									{states.map((state) => (
										<option key={state.id} value={state.id}>
											{state.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex-1">
								<Label htmlFor="newLocation">Location Name</Label>
								<Input
									id="newLocation"
									value={newLocation.name}
									onChange={(e) => setNewLocation({ name: e.target.value })}
									placeholder="Location name"
									required
								/>
							</div>
							<Button type="submit" disabled={loading} className="h-10">
								Add
							</Button>
						</form>
					</div>

					{/* Section 3: Shipping Fee Management */}
					<div className="mb-8 mt-6">
						<h2 className="text-lg font-bold mb-2">Shipping Fee Management</h2>
						<div className="flex gap-2 items-end">
							<div className="flex-1">
								<Label htmlFor="feeState">State</Label>
								<select
									id="feeState"
									className="w-full border rounded px-3 py-2 mt-1"
									value={selectedState}
									onChange={(e) => setSelectedState(e.target.value)}
								>
									<option value="">-- Select State --</option>
									{states.map((state) => (
										<option key={state.id} value={state.id}>
											{state.name}
										</option>
									))}
								</select>
							</div>
							<div className="flex-1">
								<Label htmlFor="feeLocation">Location</Label>
								<select
									id="feeLocation"
									className="w-full border rounded px-3 py-2 mt-1"
									value={selectedLocation}
									onChange={(e) => setSelectedLocation(e.target.value)}
									disabled={!selectedState}
								>
									<option value="">-- Select Location --</option>
									{locations
										.filter((l) => l.stateId === selectedState)
										.map((loc) => (
											<option key={loc.id} value={loc.id}>
												{loc.name}
											</option>
										))}
								</select>
							</div>
							<div>
								<Label htmlFor="feeInput">Shipping Fee</Label>
								<Input
									id="feeInput"
									type="number"
									min="0"
									step="0.01"
									value={feeInput}
									onChange={(e) => setFeeInput(e.target.value)}
									placeholder="Fee"
									disabled={!selectedLocation}
									className="w-32"
								/>
							</div>
							<Button
								type="button"
								disabled={!selectedLocation || loading}
								className="h-10"
								onClick={handleSaveFee}
							>
								Save
							</Button>
						</div>
					</div>

					<Separator className="mb-6" />

					{/* Section 4: All Locations */}
					<div className="mt-8">
						<h2 className="text-lg font-bold mb-2">All Locations</h2>
						<div className="mb-4 flex items-center gap-2">
							<Label htmlFor="tableFilterState">Filter by State</Label>
							<select
								id="tableFilterState"
								className="border rounded px-3 py-2"
								value={tableFilterState}
								onChange={(e) => setTableFilterState(e.target.value)}
							>
								<option value="">All States</option>
								{states.map((state) => (
									<option key={state.id} value={state.id}>
										{state.name}
									</option>
								))}
							</select>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>State</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Shipping Fee</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{locations.filter((loc) => !tableFilterState || loc.stateId === tableFilterState).length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center">
											No locations found.
										</TableCell>
									</TableRow>
								) : (
									locations
										.filter((loc) => !tableFilterState || loc.stateId === tableFilterState)
										.map((loc) => {
											const state = states.find((s) => s.id === loc.stateId);
											return (
												<TableRow key={loc.id}>
													<TableCell>{state?.name || "-"}</TableCell>
													<TableCell>
														{editingLocationId === loc.id ? (
															<Input
																value={editingLocationName}
																onChange={(e) => setEditingLocationName(e.target.value)}
																className="w-32"
															/>
														) : (
															loc.name
														)}
													</TableCell>
													<TableCell>
														{editingLocationId === loc.id ? (
															<Input
																type="number"
																min="0"
																step="0.01"
																value={editingLocationFee}
																onChange={(e) => setEditingLocationFee(e.target.value)}
																className="w-24"
															/>
														) : (
															loc.shippingFee ?? "-"
														)}
													</TableCell>
													<TableCell className="text-right">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon">
																	<MoreVertical className="h-5 w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																{editingLocationId === loc.id ? (
																	<>
																		<DropdownMenuItem onClick={() => handleSaveEditLocation(loc.id)}>
																			Save
																		</DropdownMenuItem>
																		<DropdownMenuItem onClick={() => setEditingLocationId(null)}>
																			Cancel
																		</DropdownMenuItem>
																	</>
																) : (
																	<>
																		<DropdownMenuItem onClick={() => handleEditLocation(loc)}>
																			Edit
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			variant="destructive"
																			onClick={() => handleDeleteLocation(loc.id)}
																		>
																			Delete
																		</DropdownMenuItem>
																	</>
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											);
										})
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
