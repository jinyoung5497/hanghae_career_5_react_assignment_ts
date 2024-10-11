import { NewProductDTO } from '@/api/dtos/productDTO';
import { ChangeEvent, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ALL_CATEGORY_ID, categories } from '@/constants';
import { createNewProduct, initialProductState } from '@/helpers/product';
import { useAddProduct } from '@/hooks/useProduct';
import { useToastStore } from '@/store_zustand/toast/toastStore';
import { uploadImage } from '@/utils/imageUpload';
import { useForm } from 'react-hook-form';

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

type FormFields = {
  title: string;
  price: number;
  description: string;
  categoryId: string;
  image: FileList;
};

export const ProductRegistrationModal: React.FC<
  ProductRegistrationModalProps
> = ({ isOpen, onClose, onProductAdded }) => {
  const { mutate: addProduct } = useAddProduct();
  const { setIsToast, setMessage } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      categoryId: '',
      image: undefined,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState({
    id: '',
    name: '',
  });

  // handleCategoryChange 함수를 useCallback으로 최적화
  const handleCategoryChange = useCallback((id: string) => {
    const selected = categories.find((category) => category.id === id);
    if (selected) {
      setSelectedCategory({ id: selected.id, name: selected.name });
    }
  }, []);

  // onSubmit 함수도 useCallback으로 최적화
  const onSubmit = useCallback(
    async (data: FormFields) => {
      try {
        if (!imageFile) {
          throw new Error('이미지를 선택해야 합니다.');
        }

        const imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        // NewProductDTO에 image 속성 추가
        const newProduct: NewProductDTO = {
          title: data.title,
          price: data.price,
          description: data.description,
          category: { id: selectedCategory.id, name: selectedCategory.name },
          image: imageUrl,
        };

        await addProduct(newProduct);
        onClose();
        onProductAdded();
        setIsToast();
        setMessage('상품등록 성공!');
        reset(); // 폼 리셋
      } catch (error) {
        console.error('물품 등록에 실패했습니다.', error);
        setIsToast();
        setMessage('상품등록 실패!');
      }
    },
    [
      imageFile,
      selectedCategory,
      addProduct,
      onClose,
      onProductAdded,
      reset,
      setIsToast,
      setMessage,
    ]
  );

  // handleImageChange 함수도 useCallback으로 최적화
  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  }, []);

  // 카테고리 목록을 useMemo로 메모이제이션
  const categoryItems = useMemo(() => {
    return categories
      .filter((category) => category.id !== ALL_CATEGORY_ID)
      .map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      ));
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Input
              {...register('title', { required: '상품명을 입력해야 합니다.' })}
              placeholder="상품명"
            />
            {errors.title && <p>{errors.title.message}</p>}

            <Input
              {...register('price', {
                required: '가격을 입력해야 합니다.',
                pattern: {
                  value: /^[0-9]+$/,
                  message: '숫자만 입력 가능합니다.',
                },
              })}
              type="number"
              placeholder="가격"
            />
            {errors.price && <p>{errors.price.message}</p>}

            <Textarea
              {...register('description', {
                required: '설명을 입력해야 합니다.',
              })}
              className="resize-none"
              placeholder="상품 설명"
            />
            {errors.description && <p>{errors.description.message}</p>}

            <Select
              onValueChange={handleCategoryChange}
              value={selectedCategory.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>{categoryItems}</SelectContent>
            </Select>

            <Input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.image && <p>{errors.image.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
