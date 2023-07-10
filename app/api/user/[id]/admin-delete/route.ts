import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../../lib/prismadb';
import {v2 as cloudinary} from 'cloudinary';

interface UserParams {
   id: string;
}

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function DELETE(req: NextRequest, {params}: {params: UserParams}) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   const userId = params?.id;

   //    validate user
   const validUser = await prisma.user.findUnique({
      where: {
         id: userId,
      },
   });

   if (!validUser) {
      return NextResponse.json({success: false, message: 'Invalid User.'});
   }

   //authorization
   if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({success: false, message: 'UnAuthorized.'});
   }

   //get the user image associated with the user and then delete it from cloudinary, database and then delete the user

   const foundImage = await prisma.userImage.findUnique({
      where: {
         userId: validUser?.id,
      },
   });

   if (foundImage) {
      // delete from clodinary
      await cloudinary.uploader.destroy(foundImage?.public_id);
   }

   //delete the user
   await prisma.user.delete({
      where: {
         id: validUser?.id,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'Profile Deleted.',
   });
}
