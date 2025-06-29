import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  loading: {
    products: boolean;
    categories: boolean;
    orders: boolean;
  };
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  }>;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  isSearchOpen: false,
  loading: {
    products: false,
    categories: false,
    orders: false,
  },
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },

    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },

    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },

    setLoading: (
      state,
      action: PayloadAction<{ key: keyof UiState["loading"]; value: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.value;
    },

    addNotification: (
      state,
      action: PayloadAction<Omit<UiState["notifications"][0], "id">>
    ) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
