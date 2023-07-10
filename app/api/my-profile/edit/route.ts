import {NextResponse, NextRequest} from 'next/server';

import prisma from '../../../lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import {v2 as cloudinary} from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function PATCH(req: NextRequest) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   //  getting the request data
   const body = await req.json();

   //check if its the owner of the profile that isnactually updating the profile
   if (currentUser.id !== body?.id) {
      return NextResponse.json({success: false, message: 'Not authorized.'});
   }

   //check if the user id is valid
   const foundUser = await prisma.user.findUnique({
      where: {
         id: body.id,
      },
      include: {
         profilePic: {
            select: {
               id: true,
               public_id: true,
               url: true,
            },
         },
      },
   });

   if (!foundUser) {
      return NextResponse.json({
         success: false,
         message: 'Invalid User.',
      });
   }

   if (foundUser?.username !== body?.username) {
      //check if username exists
      const usernameExists = await prisma.user.findUnique({
         where: {
            username: body.username,
         },
      });

      if (usernameExists) {
         return NextResponse.json({
            success: false,
            message: 'Username exists.',
         });
      }
   }

   if (body?.image) {
      //delete the image first before uploading another

      if (foundUser?.profilePic !== null) {
         //delete from cloudinary
         await cloudinary.uploader.destroy(foundUser?.profilePic?.public_id);
         //delete image from database
         await prisma.userImage.delete({
            where: {
               id: foundUser?.profilePic?.id,
            },
         });
      }
      //work on cloudinary image upload
      const uploadedImage = await cloudinary.uploader.upload(body?.image, {
         folder: 'marketUserImages',
      });

      //creating new profile image
      await prisma.userImage.create({
         data: {
            public_id: uploadedImage?.public_id,
            url: uploadedImage?.secure_url,
            userId: foundUser?.id,
         },
      });
      //the update
      await prisma.user.update({
         where: {
            id: foundUser?.id,
         },
         data: {
            name: body?.name,
            username: body?.username,
            image: uploadedImage?.secure_url,
         },
      });

      return NextResponse.json({success: true, message: 'Profile Updated'});
   } else {
      await prisma.user.update({
         where: {
            id: foundUser?.id,
         },
         data: {
            name: body?.name,
            username: body?.username,
         },
      });
      return NextResponse.json({success: true, message: 'Profile Updated'});
   }
}
