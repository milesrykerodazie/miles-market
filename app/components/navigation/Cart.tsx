'use client';

import Link from 'next/link';
import {BsFillCartCheckFill} from 'react-icons/bs';
import {useAppSelector} from '../../state-management/hooks';
import {selectCartItems} from '../../state-management/features/cartSlice';

const Cart = () => {
   //getting the cartItems
   const cartItems = useAppSelector(selectCartItems);

   return (
      <div>
         <Link
            href='/cart'
            className='px-3 py-2 text-center text-white dark:text-primary bg-primary border border-primary rounded-md hover:bg-primary/80 dark:bg-white flex items-center space-x-2 trans'
         >
            <BsFillCartCheckFill />
            <span className='hidden lg:inline ml-1'> Cart</span>
            <span className='font-semibold'>({cartItems?.length})</span>
         </Link>
      </div>
   );
};

export default Cart;
