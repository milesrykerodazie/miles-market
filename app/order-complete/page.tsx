import OrderPage from '@/app/components/order/OrderPage';
import React from 'react';
import getCurrentUser from '../actions/getCurrentUser';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'Order Complete',
};

interface OrderProps {
   searchParams: {
      success: string;
   };
}

const OrdersPage = async ({searchParams}: OrderProps) => {
   const currentUser = await getCurrentUser();

   return (
      <OrderPage success={searchParams?.success} role={currentUser?.role} />
   );
};

export default OrdersPage;
