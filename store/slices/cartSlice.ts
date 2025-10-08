import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  customPrint: boolean;
  printText?: string;
  printPrice?: number;
  maxQuantity: number;
  sku: string;
  isSample?: boolean; // Track if this is a sample purchase
  minQuantity?: number; // Minimum quantity allowed (1 for sample, 5 for regular)
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  subtotal: 0,
  total: 0,
  itemCount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice =
      item.price + (item.customPrint ? item.printPrice || 0 : 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, total: subtotal, itemCount };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "id">>) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.customPrint === action.payload.customPrint &&
          item.printText === action.payload.printText
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        existingItem.quantity = Math.min(newQuantity, existingItem.maxQuantity);
      } else {
        state.items.push({
          ...action.payload,
          id: `${action.payload.productId}-${Date.now()}`,
        });
      }

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        // Determine minimum quantity based on whether it's a sample
        const minQty = item.isSample ? 1 : (item.minQuantity || 5);
        
        // For sample items, quantity is always locked at 1
        if (item.isSample) {
          item.quantity = 1;
        } else {
          // For regular items, enforce minimum of 5
          item.quantity = Math.min(
            Math.max(action.payload.quantity, minQty),
            item.maxQuantity
          );
        }
      }

      const totals = calculateTotals(state.items);
      state.subtotal = totals.subtotal;
      state.total = totals.total;
      state.itemCount = totals.itemCount;
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      state.itemCount = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
