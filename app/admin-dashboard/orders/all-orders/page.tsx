import getAllOrders from '@/app/actions/getAllOrders';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Orders from '@/app/components/admin/Orders';
import React from 'react';
import MiniSearch from '@/app/components/admin/MiniSearch';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | All-Orders',
};

interface OrderParams {
   searchParams: {
      keyword: string;
   };
}

const AllOrders = async ({searchParams}: OrderParams) => {
   //get current user
   const currentUser = await getCurrentUser();
   //get all orders
   const allOrders = await getAllOrders(
      currentUser?.role,
      currentUser?.id,
      searchParams,
   );
   return (
      <>
         <MiniSearch difference='order-search' />
         {/* @ts-expect-error */}
         <Orders allOrders={allOrders} />
      </>
   );
};

export default AllOrders;
