import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../../lib/prismadb';

interface AddressParams {
   id: string;
}

export async function PATCH(
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

   const body = await req.json();

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

   //update address
   const updatedAddress = await prisma.address.update({
      where: {
         id: id,
      },
      data: {
         ...body,
      },
   });

   if (updatedAddress) {
      return NextResponse.json({success: true, message: 'Address Updated!'});
   }
}
