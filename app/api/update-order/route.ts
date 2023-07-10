import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function PATCH(req: NextRequest) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error;
   }

   if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({success: false, message: 'Unauthorized!'});
   }
   //getting the request data
   const body = await req.json();

   //    validate order id
   const validOrder = await prisma.order.findUnique({
      where: {
         id: body?.orderId,
      },
   });

   if (!validOrder) {
      return NextResponse.json({success: false, message: 'Order Not Found.'});
   }

   //update the order status
   const updatedOrder = await prisma.order.update({
      where: {
         id: validOrder?.id,
      },
      data: {
         orderStatus: body?.orderStatus,
      },
   });

   if (updatedOrder) {
      return NextResponse.json({
         success: true,
         message: 'Order Status updated.',
      });
   } else {
      return NextResponse.json({
         success: false,
         message: 'Order Status Not updated.',
      });
   }
}
