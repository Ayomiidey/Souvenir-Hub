import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sku: string;
  inStock: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

const initialState: WishlistState = {
  items: [],
  isOpen: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    toggleWishlist: (state) => {
      state.isOpen = !state.isOpen;
    },

    setWishlistOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
  setWishlistOpen,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
