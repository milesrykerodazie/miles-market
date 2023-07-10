import {Middleware} from '@reduxjs/toolkit';

import {
   addItemToCart,
   deleteItemFromCart,
   saveOnCheckout,
   setCartItems,
} from './features/cartSlice';

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
   const result = next(action); // Call the next middleware or reducer

   // Handle specific actions
   if (
      action.type === setCartItems.type ||
      action.type === addItemToCart.type ||
      action.type === deleteItemFromCart.type
   ) {
      const {cartItems} = store.getState().cart;

      try {
         localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
         console.error('Error saving cart items to local storage:', error);
      }
   }

   if (action.type === saveOnCheckout.type) {
      const {checkoutInfo} = store.getState().cart;

      try {
         localStorage.setItem('cartCheckout', JSON.stringify(checkoutInfo));
      } catch (error) {
         console.error('Error saving checkout info to local storage:', error);
      }
   }

   return result;
};

export default localStorageMiddleware;
