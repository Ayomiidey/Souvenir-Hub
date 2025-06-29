import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  search: string;
  category: string;
  subcategory: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: "price-asc" | "price-desc" | "popularity" | "newest";
  isFilterOpen: boolean;
}

const initialState: FiltersState = {
  search: "",
  category: "",
  subcategory: "",
  priceRange: [0, 1000],
  inStockOnly: false,
  sortBy: "popularity",
  isFilterOpen: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.subcategory = ""; // Reset subcategory when category changes
    },

    setSubcategory: (state, action: PayloadAction<string>) => {
      state.subcategory = action.payload;
    },

    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },

    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<
        "price-asc" | "price-desc" | "popularity" | "newest"
      >
    ) => {
      state.sortBy = action.payload;
    },

    toggleFilters: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },

    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterOpen = action.payload;
    },

    resetFilters: (state) => {
      state.search = "";
      state.category = "";
      state.subcategory = "";
      state.priceRange = [0, 1000];
      state.inStockOnly = false;
      state.sortBy = "popularity";
    },
  },
});

export const {
  setSearch,
  setCategory,
  setSubcategory,
  setPriceRange,
  setInStockOnly,
  setSortBy,
  toggleFilters,
  setFiltersOpen,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
