import getCurrentUser from '@/app/actions/getCurrentUser';
import getOrder from '@/app/actions/getOrderById';
import Order from '@/app/components/admin/Order';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Order',
};

import React from 'react';

interface OrderParams {
   id: string;
}

const OrderPage = async ({params}: {params: OrderParams}) => {
   //get current user
   const currentUser = await getCurrentUser();
   //get the order
   const order = await getOrder(params, currentUser?.role, currentUser?.id);

   return (
      //@ts-expect-error
      <Order order={order} />
   );
};

export default OrderPage;
