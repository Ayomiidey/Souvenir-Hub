
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, MapPin } from "lucide-react";
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
	// Removed add state and add location state
	const [feeInput, setFeeInput] = useState<string>("");
	const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("200000");
	const [savingThreshold, setSavingThreshold] = useState(false);
	const [editingLocation, setEditingLocation] = useState<string | null>(null);
	const [editFeeInput, setEditFeeInput] = useState<string>("");

	// Fetch all states
	useEffect(() => {
		fetch("/api/admin/states?limit=1000")
			.then((res) => res.json())
			.then((data) => setStates(Array.isArray(data) ? data : data.states || []))
			.catch(() => setStates([]));
	}, []);

	// Fetch locations for selected state (for dropdowns and table)
	// Fetch all locations for the table and dropdowns
	const fetchLocations = () => {
		setLoading(true);
		fetch(`/api/admin/locations?limit=10000`)
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

	// Fetch free shipping threshold
	useEffect(() => {
		fetch("/api/settings/free-shipping-threshold")
			.then((res) => res.json())
			.then((data) => {
				if (data.value) {
					setFreeShippingThreshold(data.value);
				}
			})
			.catch(() => toast.error("Failed to load free shipping threshold"));
	}, []);

	// Save free shipping threshold
	const handleSaveThreshold = async () => {
		setSavingThreshold(true);
		try {
			const res = await fetch("/api/settings/free-shipping-threshold", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ value: Number(freeShippingThreshold) }),
			});

			if (res.ok) {
				toast.success("Free shipping threshold updated!");
			} else {
				toast.error("Failed to update threshold");
			}
		} catch {
			toast.error("An error occurred");
		} finally {
			setSavingThreshold(false);
		}
	};

	// Removed add state and add location handlers

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

	// Start editing a location's fee
	const handleStartEdit = (location: Location) => {
		setEditingLocation(location.id);
		setEditFeeInput(location.shippingFee?.toString() || "0");
	};

	// Save edited fee
	const handleSaveEditFee = async () => {
		if (!editingLocation || !editFeeInput) return;
		setLoading(true);
		const res = await fetch(`/api/admin/locations/${editingLocation}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ shippingFee: Number(editFeeInput) }),
		});
		setLoading(false);
		if (res.ok) {
			toast.success("Shipping fee updated!");
			setEditingLocation(null);
			setEditFeeInput("");
			fetchLocations();
		} else {
			toast.error("Failed to update shipping fee");
		}
	};

	// Cancel editing
	const handleCancelEdit = () => {
		setEditingLocation(null);
		setEditFeeInput("");
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
						Shipping Fee Management
					</h1>
					<p className="text-gray-600 mt-2">
						Configure shipping costs and free shipping thresholds
					</p>
				</div>

				<div className="space-y-8">
					{/* Section 1: Free Shipping Threshold */}
					<div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100/50 shadow-sm">
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
								<div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
								Free Shipping Threshold
							</h2>
							<p className="text-gray-600 text-sm">
								Set the minimum order amount required for customers to qualify for free shipping.
							</p>
						</div>
						<div className="flex gap-4 items-end">
							<div className="flex-1 max-w-xs">
								<Label htmlFor="freeShippingThreshold" className="text-sm font-semibold text-gray-700">Minimum Order Amount (₦)</Label>
								<Input
									id="freeShippingThreshold"
									type="number"
									min="0"
									step="1000"
									value={freeShippingThreshold}
									onChange={(e) => setFreeShippingThreshold(e.target.value)}
									placeholder="e.g., 200000"
									className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
								/>
							</div>
							<Button
								type="button"
								disabled={savingThreshold}
								onClick={handleSaveThreshold}
								className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white border-0"
							>
								{savingThreshold ? "Saving..." : "Save Threshold"}
							</Button>
						</div>
					</div>

					{/* Section 2: Set Shipping Fee */}
					<div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100/50 shadow-sm">
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
								<div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
								Set Shipping Fee
							</h2>
							<p className="text-gray-600 text-sm">
								Update shipping costs for specific locations.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
							<div>
								<Label className="text-sm font-semibold text-gray-700">Select State</Label>
								<select
									value={selectedState}
									onChange={(e) => setSelectedState(e.target.value)}
									className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
								>
									<option value="">Select State</option>
									{states.map((state) => (
										<option key={state.id} value={state.id}>
											{state.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<Label className="text-sm font-semibold text-gray-700">Select Location</Label>
								<select
									value={selectedLocation}
									onChange={(e) => setSelectedLocation(e.target.value)}
									disabled={!selectedState}
									className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white disabled:opacity-50"
								>
									<option value="">Select Location</option>
									{locations
										.filter((loc) => loc.stateId === selectedState)
										.map((location) => (
											<option key={location.id} value={location.id}>
												{location.name}
											</option>
										))}
								</select>
							</div>
							<div>
								<Label className="text-sm font-semibold text-gray-700">Shipping Fee (₦)</Label>
								<Input
									type="number"
									min="0"
									step="100"
									value={feeInput}
									onChange={(e) => setFeeInput(e.target.value)}
									placeholder="e.g., 2500"
									disabled={!selectedLocation}
									className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
								/>
							</div>
						</div>
						<Button
							onClick={handleSaveFee}
							disabled={!selectedLocation || !feeInput || loading}
							className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0"
						>
							{loading ? "Saving..." : "Save Fee"}
						</Button>
					</div>

					{/* Section 3: Locations Table */}
					<div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-100/50 shadow-sm">
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
								<div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
								Shipping Locations ({locations.length})
							</h2>
							<p className="text-gray-600 text-sm">
								View and manage shipping fees for all locations.
							</p>
						</div>

						<div className="mb-4">
							<Label className="text-sm font-semibold text-gray-700">Filter by State</Label>
							<select
								value={tableFilterState}
								onChange={(e) => setTableFilterState(e.target.value)}
								className="w-full max-w-xs mt-2 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
							>
								<option value="">All States</option>
								{states.map((state) => (
									<option key={state.id} value={state.id}>
										{state.name}
									</option>
								))}
							</select>
						</div>

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
													<div className="h-6 bg-gray-200 rounded w-20"></div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{locations
									.filter((loc) => !tableFilterState || loc.stateId === tableFilterState)
									.map((location) => {
										const state = states.find((s) => s.id === location.stateId);
										return (
											<div
												key={location.id}
												className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm group"
											>
												<div className="flex items-start gap-4 mb-4">
													<div className="w-12 h-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
														<MapPin className="w-6 h-6 text-rose-600" />
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-rose-600 transition-colors">
															{location.name}
														</h3>
														<p className="text-sm text-gray-500">{state?.name}</p>
													</div>
												</div>

												<div className="space-y-3">
													<div className="flex justify-between items-center">
														<span className="text-sm text-gray-600">Shipping Fee</span>
														{editingLocation === location.id ? (
															<div className="flex items-center gap-2">
																<Input
																	type="number"
																	min="0"
																	step="100"
																	value={editFeeInput}
																	onChange={(e) => setEditFeeInput(e.target.value)}
																	className="w-20 h-8 text-sm"
																	autoFocus
																/>
																<Button
																	size="sm"
																	onClick={handleSaveEditFee}
																	disabled={loading}
																	className="h-8 px-2 bg-green-600 hover:bg-green-700"
																>
																	Save
																</Button>
																<Button
																	size="sm"
																	variant="outline"
																	onClick={handleCancelEdit}
																	className="h-8 px-2"
																>
																	Cancel
																</Button>
															</div>
														) : (
															<span className="text-lg font-bold text-green-600">
																₦{location.shippingFee ? Number(location.shippingFee).toLocaleString() : "0"}
															</span>
														)}
													</div>
												</div>

												<div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleStartEdit(location)}
																disabled={editingLocation !== null}
															>
																Edit Fee
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleDeleteLocation(location.id)}
																className="text-red-600"
															>
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>
										);
									})}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
