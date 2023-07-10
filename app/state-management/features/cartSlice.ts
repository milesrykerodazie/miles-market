import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface CartItem {
   productId: string;
   name: string;
   slug: string;
   price: number;
   productImage: string;
   stock: number;
   seller: string;
   quantity: number;
}

interface CheckoutInfo {
   amount: number;
   tax: number;
   totalAmount: number;
}

interface CartState {
   cartItems: CartItem[];
   checkoutInfo: CheckoutInfo | null;
}

// Retrieve cartItems from local storage
const getInitialCartItems = (): CartItem[] => {
   try {
      if (typeof localStorage !== 'undefined') {
         const cartItemsFromLocalStorage = localStorage.getItem('cartItems');
         if (cartItemsFromLocalStorage) {
            return JSON.parse(cartItemsFromLocalStorage);
         }
      }
   } catch (error) {
      console.error('Error retrieving cart items from local storage:', error);
   }
   return [];
};

const getInitialCheckoutInfo = (): CheckoutInfo | null => {
   try {
      if (typeof localStorage !== 'undefined') {
         const cartCheckoutFromLocalStorage =
            localStorage.getItem('cartCheckout');
         if (cartCheckoutFromLocalStorage) {
            return JSON.parse(cartCheckoutFromLocalStorage);
         }
      }
   } catch (error) {
      console.error(
         'Error retrieving cart checkout info from local storage:',
         error,
      );
   }
   return null;
};

const initialState: CartState = {
   cartItems: getInitialCartItems(),
   checkoutInfo: getInitialCheckoutInfo(),
};

const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {
      setCartItems: (state, action: PayloadAction<CartItem[]>) => {
         state.cartItems = action.payload;
         localStorage.setItem('cartItems', JSON.stringify(action.payload));
      },
      addItemToCart: (state, action: PayloadAction<CartItem>) => {
         const item = action.payload;
         const isItemExist = state.cartItems.find(
            (i) => i.productId === item.productId,
         );

         if (isItemExist) {
            state.cartItems = state.cartItems.map((i) =>
               i.productId === isItemExist.productId ? item : i,
            );
         } else {
            state.cartItems.push(item);
         }
      },

      deleteItemFromCart: (state, action: PayloadAction<string>) => {
         const id = action.payload;
         state.cartItems = state.cartItems.filter((i) => i.productId !== id);
      },
      saveOnCheckout: (state, action: PayloadAction<CheckoutInfo>) => {
         const checkoutInfo = action.payload;
         state.checkoutInfo = checkoutInfo;
      },
      clearCart: (state) => {
         state.cartItems = [];
         state.checkoutInfo = null;
         localStorage.removeItem('cartItems');
         localStorage.removeItem('cartCheckout');
      },
   },
});

export const {
   setCartItems,
   addItemToCart,
   deleteItemFromCart,
   saveOnCheckout,
   clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCheckoutInfo = (state: RootState) => state.cart.checkoutInfo;

export default cartSlice.reducer;
