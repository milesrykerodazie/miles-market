import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../../lib/prismadb';

interface AddressParams {
   id: string;
}

export async function DELETE(
   req: NextRequest,
   {params}: {params: AddressParams},
) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   //getting the params
   const {id} = params;

   //check if the
   const foundAddress = await prisma.address.findUnique({
      where: {
         id: id,
      },
   });

   if (!foundAddress) {
      return NextResponse.json({
         success: false,
         message: 'Address does not exist.',
      });
   }

   //check if the user is authorized
   if (foundAddress?.userId !== currentUser?.id) {
      return NextResponse.json({
         success: false,
         message: 'Unauthorized.',
      });
   }

   //DELETE ADDRESS
   await prisma.address.delete({
      where: {
         id: foundAddress?.id,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'Address deleteted!',
   });
}
