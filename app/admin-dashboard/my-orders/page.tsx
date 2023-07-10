import getCurrentUser from '@/app/actions/getCurrentUser';
import getUserOrders from '@/app/actions/getUserOrders';
import OrdersPage from '@/app/components/order/Orders';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | My-Orders',
};

const MyOrders = async () => {
   //getting the current user
   const currentUser = await getCurrentUser();
   //get user orders
   const userOrders = await getUserOrders(currentUser?.id!);
   return (
      //@ts-expect-error
      <OrdersPage userOrders={userOrders} />
   );
};

export default MyOrders;
