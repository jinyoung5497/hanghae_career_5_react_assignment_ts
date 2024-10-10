// store/authStore.ts
import { create } from 'zustand';
import { IUser } from '@/types/authType';

interface AuthState {
  isLogin: boolean;
  user: IUser | null;
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
  registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  registerError: string | null;
  setRegisterStatus: (
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
  ) => void;
  setRegisterError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  user: null,
  registerStatus: 'idle',
  registerError: null,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setUser: (user: IUser) => set({ user, isLogin: true }),
  logout: () => set({ isLogin: false, user: null }),
  setRegisterStatus: (status) => set({ registerStatus: status }),
  setRegisterError: (error) => set({ registerError: error }),
}));
