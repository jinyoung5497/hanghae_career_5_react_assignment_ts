import { create } from 'zustand';
import { CartItem } from '@/types/cartType';
import {
  calculateTotal,
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
} from './cartUtils';

interface CartState {
  cart: CartItem[];
  totalCount: number;
  totalPrice: number;
  initCart: (userId: string) => void;
  resetCart: (userId: string) => void;
  addCartItem: (item: CartItem, userId: string, count: number) => void;
  removeCartItem: (itemId: string, userId: string) => void;
  changeCartItemCount: (itemId: string, count: number, userId: string) => void;
}
export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,
  initCart: (userId) => {
    // if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set(() => ({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    }));
  },
  resetCart: (userId) => {
    resetCartAtLocalStorage(userId);
    set(() => ({
      cart: [],
      totalCount: 0,
      totalPrice: 0,
    }));
  },

  addCartItem: (item, userId, count) => {
    const state = get();
    const existingItemIndex = state.cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      // Update the quantity of the existing item
      updatedCart = state.cart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, count: cartItem.count + count }
          : cartItem
      );
    } else {
      // Add new item to the cart
      updatedCart = [...state.cart, { ...item, count }];
    }

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });

    setCartToLocalStorage(updatedCart, userId);
  },

  removeCartItem: (itemId, userId) => {
    const state = get();
    const filterCart = state.cart.filter((item) => item.id !== itemId);
    const total = calculateTotal(filterCart);
    set(() => ({
      cart: filterCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    }));
    setCartToLocalStorage(filterCart, userId);
  },
  changeCartItemCount: (itemId, count, userId) => {
    const state = get();
    const itemIndex = state.cart.findIndex((item) => item.id === itemId);
    let changeCart: CartItem[] = state.cart;
    if (itemIndex !== -1) {
      changeCart = state.cart.map((cartItem, index) =>
        index === itemIndex ? { ...cartItem, count } : cartItem
      );
    }
    const total = calculateTotal(changeCart);
    set(() => ({
      cart: changeCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    }));
    setCartToLocalStorage(changeCart, userId);
  },
}));
