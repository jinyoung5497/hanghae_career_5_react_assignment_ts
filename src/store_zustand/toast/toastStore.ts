import { create } from 'zustand';

interface ToastState {
  isToast: boolean;
  message: string;
  setIsToast: () => void;
  setMessage: (message: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isToast: false,
  message: '',
  setIsToast: () => set((state) => ({ isToast: !state.isToast })),
  setMessage: (message: string) => set({ message }),
}));
