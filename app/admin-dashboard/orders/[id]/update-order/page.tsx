import getCurrentUser from '@/app/actions/getCurrentUser';
import getOrder from '@/app/actions/getOrderById';
import OrderUpdate from '@/app/components/admin/UpdateOrder';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Update-Order',
};

interface OrderParams {
   id: string;
}

const UpdateOrder = async ({params}: {params: OrderParams}) => {
   //get current user
   const currentUser = await getCurrentUser();
   //get the order
   const order = await getOrder(params, currentUser?.role, currentUser?.id);

   return (
      //@ts-expect-error
      <OrderUpdate order={order} />
   );
};

export default UpdateOrder;
