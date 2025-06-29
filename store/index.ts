import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"

import cartSlice from "./slices/cartSlice"
import wishlistSlice from "./slices/wishlistSlice"
import filtersSlice from "./slices/filtersSlice"
import uiSlice from "./slices/uiSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"], // Only persist cart and wishlist
}

const rootReducer = combineReducers({
  cart: cartSlice,
  wishlist: wishlistSlice,
  filters: filtersSlice,
  ui: uiSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
