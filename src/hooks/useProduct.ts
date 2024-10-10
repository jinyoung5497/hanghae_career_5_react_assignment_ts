import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import { fetchProducts } from '@/api/product';
import { ProductFilter } from '@/types/productType';
import { PaginatedProductsDTO } from '@/api/dtos/productDTO';
import { addProductAPI } from '@/api/product';
import { IProduct, NewProductDTO } from '@/api/dtos/productDTO';
import { useProductStore } from '@/store_zustand/product/productStore';

export const useLoadProducts = (
  filter: ProductFilter,
  pageSize: number,
  page: number,
  isInitial: boolean
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['products', filter, pageSize, page],
    queryFn: () => fetchProducts(filter, pageSize, page),
  });

  return { data, error, isLoading, isInitial };
};

export const useAddProduct = () => {
  const { setAdd, setError } = useProductStore();

  return useMutation<IProduct, Error, NewProductDTO>({
    mutationFn: async (userData: NewProductDTO) => {
      return await addProductAPI(userData);
    },
    onSuccess: (newProduct) => {
      setAdd(newProduct);
    },
    onError: () => {
      setError();
    },
  });
};
