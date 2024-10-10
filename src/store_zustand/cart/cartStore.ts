import { create } from 'zustand';
import {
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
  calculateTotal,
} from './cartUtils';
import { CartItem } from '@/types/cartType'; // Assuming you have a CartItem type defined

// Define the state shape for the cart store
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

// Create the Zustand store with type annotations
export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,

  // Initialize the cart with items from local storage
  initCart: (userId) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
  },

  // Reset the cart
  resetCart: (userId: string) => {
    resetCartAtLocalStorage(userId);
    set({
      cart: [],
      totalCount: 0,
      totalPrice: 0,
    });
  },

  // Add an item to the cart
  addCartItem: (item, userId, count) => {
    const cart = get().cart || [];
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    let updatedCart: CartItem[];

    if (existingItemIndex !== -1) {
      // Update the quantity of the existing item
      updatedCart = cart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, count: cartItem.count + count }
          : cartItem
      );
    } else {
      // Add a new item to the cart
      updatedCart = [...cart, { ...item, count }];
    }

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
    setCartToLocalStorage(updatedCart, userId);
  },

  // Remove an item from the cart
  removeCartItem: (itemId: string, userId: string) => {
    const cart = get().cart || [];
    const updatedCart = cart.filter((item) => item.id !== itemId);

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
    setCartToLocalStorage(updatedCart, userId);
  },

  // Change the quantity of an item in the cart
  changeCartItemCount: (itemId: string, count: number, userId: string) => {
    const cart = get().cart || [];
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, count } : item
    );

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
    setCartToLocalStorage(updatedCart, userId);
  },
}));

export default useCartStore;
