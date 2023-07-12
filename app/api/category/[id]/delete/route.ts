import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../../../lib/prismadb';
interface CategoryParams {
   id: string;
}
export async function DELETE(
   req: NextRequest,
   {params}: {params: CategoryParams},
) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error;
   }

   if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({success: false, message: 'Unauthorized!'});
   }

   //getting the params
   const {id} = params;

   //    validate category id
   const validCategory = await prisma.category.findUnique({
      where: {
         id: id,
      },
   });

   if (!validCategory) {
      return NextResponse.json({
         success: false,
         message: 'Category Not Found.',
      });
   }

   //update the order status
   await prisma.category.delete({
      where: {
         id: validCategory?.id,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'Category deleted.',
   });
}
