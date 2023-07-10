import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../lib/prismadb';
import * as argon from 'argon2';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req: NextRequest) {
   //get user password
   const currentUser = await getCurrentUser();

   //    the request body
   const body = await req.json();

   //check if the current password is correct
   //comparing password
   const isCorrectPassword = await argon.verify(
      currentUser?.password!,
      body?.currentPassword,
   );

   if (!isCorrectPassword) {
      return NextResponse.json({
         success: false,
         message: 'Incorrect Password!',
      });
   }

   //    check if it is same password chosen
   const samePassword = await argon.verify(
      currentUser?.password!,
      body?.newPassword,
   );

   if (samePassword) {
      return NextResponse.json({
         success: false,
         message: 'Use Another Password!',
      });
   }
   //    encrypting the new password
   const hashedPassword = await argon.hash(body?.newPassword);

   //creating a new password
   await prisma.user.update({
      where: {
         id: currentUser?.id,
      },
      data: {
         password: hashedPassword,
      },
   });

   return NextResponse.json({success: true, message: 'Password Updated.'});
}
