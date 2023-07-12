import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../../../lib/prismadb';

interface CategoryParams {
   id: string;
}
export async function PATCH(
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
   //getting the request data
   const body = await req.json();

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

   //change name to lowercase
   const validCatName = body?.name.toLowerCase();

   //update the order status
   const updatedCategory = await prisma.category.update({
      where: {
         id: validCategory?.id,
      },
      data: {
         categoryName: validCatName,
      },
   });

   if (updatedCategory) {
      return NextResponse.json({
         success: true,
         message: 'Category Name updated.',
      });
   } else {
      return NextResponse.json({
         success: false,
         message: ' update failed.',
      });
   }
}
