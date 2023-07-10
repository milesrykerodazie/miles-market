import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../../lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface OrderParams {
   id: string;
}

export async function DELETE(
   req: NextRequest,
   {params}: {params: OrderParams},
) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error;
   }

   const orderId = params?.id;

   //    validate order id
   const validOrder = await prisma.order.findUnique({
      where: {
         id: orderId,
      },
   });

   if (!validOrder) {
      return NextResponse.json({success: false, message: 'Order Not Found.'});
   }

   if (currentUser?.id !== validOrder?.userId) {
      return NextResponse.json({success: false, message: 'Unauthorized!'});
   }

   //delete Order
   await prisma.order.delete({
      where: {
         id: validOrder?.id,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'Order Deleted.',
   });
}
