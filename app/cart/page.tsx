import React from 'react';
import Cart from '../components/cart/Cart';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'Cart',
};

const CartPage = () => {
   return <Cart />;
};

export default CartPage;
