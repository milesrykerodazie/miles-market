import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../lib/prismadb';

export async function POST(req: NextRequest) {
   //getting the current user
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   const body = await req.json();

   //check if the user more than three addresses
   //this means i have to query the database for addresses owned by the current user

   const userAddresses = await prisma.address.findMany({
      where: {
         userId: currentUser?.id,
      },
   });

   if (userAddresses?.length === 3) {
      return NextResponse.json({
         success: false,
         message: 'You can have only 3 addresses!',
      });
   }

   // create a new address in the address book
   const newAddress = await prisma.address.create({
      data: {
         userId: currentUser?.id,
         country: body?.country,
         state: body?.state,
         city: body?.city,
         street: body?.street,
         phoneNo: body?.phoneNo,
      },
   });

   if (newAddress) {
      return NextResponse.json({success: true, message: 'Address added!'});
   } else {
      return NextResponse.json({
         success: false,
         message: 'Address not addded!',
      });
   }
}
