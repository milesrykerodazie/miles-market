import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../../lib/prismadb';

interface UserParams {
   id: string;
}

export async function PATCH(req: NextRequest, {params}: {params: UserParams}) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({success: false, message: 'UnAuthorized.'});
   }

   //getting the id from the params
   const {id} = params;
   //  getting the request data
   const body = await req.json();

   //check if the user id is valid
   const foundUser = await prisma.user.findUnique({
      where: {
         id: id,
      },
   });

   if (!foundUser) {
      return NextResponse.json({
         success: false,
         message: 'Invalid User.',
      });
   }

   //update user role
   await prisma.user.update({
      where: {
         id: foundUser.id,
      },
      data: {
         role: body.role,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'User role updated.',
   });
}
