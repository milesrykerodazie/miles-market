'use client';

import {UserType} from '@prisma/client';
import Link from 'next/link';
import {useEffect} from 'react';
import {toast} from 'react-hot-toast';
import {clearCart} from '@/app/state-management/features/cartSlice';
import {useAppDispatch} from '@/app/state-management/hooks';

const OrderPage = ({
   success,
   role,
}: {
   success: string;
   role: UserType | undefined;
}) => {
   //dispatch
   const dispatch = useAppDispatch();
   useEffect(() => {
      if (success === 'true') {
         dispatch(clearCart());
         toast.success('Order successful.');
      } else {
         toast.error('Order not successful.');
      }
   }, []);
   return (
      <div className='lg:min-h-screen flex items-center justify-center pt-20 lg:pt-0'>
         <div className='max-w-2xl w-full bg-white sm:p-4 md:p-8 sm:shadow-lg md:rounded-md'>
            <h2 className=' text-xl lg:text-3xl font-bold mb-4 text-primary'>
               Order Successful
            </h2>
            <p className='text-primary text-sm md:text-base mb-6'>
               Thank you for your order!
            </p>
            <div className='flex flex-col sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4 items-center'>
               <Link
                  href='/'
                  className='bg-primary/90 hover:bg-primary text-white py-2 px-4 rounded w-full sm:w-auto trans text-sm md:text-base'
               >
                  Continue Shopping
               </Link>
               <Link
                  href={
                     role === 'ADMIN'
                        ? '/admin-dashboard/my-orders'
                        : role === 'USER'
                        ? '/user-dashboard/my-orders'
                        : '/'
                  }
                  className='bg-white text-primary shadow-sm shadow-primary py-2 px-4 rounded w-full sm:w-auto trans text-sm md:text-base'
               >
                  View Order
               </Link>
            </div>
         </div>
      </div>
   );
};

export default OrderPage;
