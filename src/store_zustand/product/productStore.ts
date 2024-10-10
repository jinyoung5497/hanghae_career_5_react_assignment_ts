import { create } from 'zustand';
import { IProduct } from '@/api/dtos/productDTO'; // Make sure this path is correct

interface ProductState {
  isLoading: boolean;
  error: string | null;
  products: IProduct[]; // Array to hold products
  hasNextPage: boolean; // Boolean to check if more products are available
  totalCount: number;
  currentPage: number;
  setLoading: (loading: boolean) => void;
  setProducts: (products: IProduct[]) => void; // Setter for products
  setHasNextPage: (hasNextPage: boolean) => void; // Setter for pagination
  setTotalCount: (totalCount: number) => void;
  setCurrentPage: (currentPage: number) => void;
  setAdd: (newProduct: IProduct) => void;
  setError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  isLoading: false,
  error: null,
  products: [], // Initialize products as an empty array
  hasNextPage: false, // Default to false, indicating no more pages
  totalCount: 0,
  currentPage: 1,
  setLoading: (loading) => set({ isLoading: loading }),
  setProducts: (products) => set({ products }), // Update products in state
  setHasNextPage: (hasNextPage) => set({ hasNextPage }), // Update pagination state
  setTotalCount: (totalCount: number) => set({ totalCount }),
  setCurrentPage: (currentPage: number) => set({ currentPage }),
  setAdd: (newProduct: IProduct) =>
    set((state) => ({
      items: [newProduct, ...state.products],
      totalCount: state.totalCount + 1,
      error: null,
    })),
  setError: () =>
    set({
      error: '상품 등록에 실패하였습니다.',
    }),
}));
