import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductInfoTableRow } from '@/pages/cart/components/ProductInfoTableRow';
import { useCartStore } from '@/store_zustand/cart/cartStore';
import { useAuthStore } from '@/store_zustand/auth/authStore';

export const ProductInfoTable = () => {
  const { cart } = useCartStore();
  const { user } = useAuthStore();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">이미지</TableHead>
          <TableHead>상품명</TableHead>
          <TableHead>갯수</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>삭제하기</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart.map((item) => (
          <ProductInfoTableRow key={item.id} item={item} user={user} />
        ))}
      </TableBody>
    </Table>
  );
};
