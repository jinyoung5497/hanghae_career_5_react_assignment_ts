import { create } from "zustand";

interface PurchaseState {
  isLoading: boolean;
  error: string | null;
  purchaseStart: () => void;
  purchaseSuccess: () => void;
  purchaseFailure: (error: string) => void;
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  isLoading: false,
  error: null,
  purchaseStart: () => set({ isLoading: true, error: null }),
  purchaseSuccess: () => set({ isLoading: false, error: null }),
  purchaseFailure: (error: string) => set({ isLoading: false, error }),
}));
