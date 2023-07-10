import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../../../lib/prismadb';
import {v2 as cloudinary} from 'cloudinary';
import getCurrentUser from '@/app/actions/getCurrentUser';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_KEY_SECRET,
});

interface ImageParams {
   id: string;
}

// first accept the ids from the body
export async function DELETE(
   req: NextRequest,
   {params}: {params: ImageParams},
) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   //getting the params
   const {id} = params;

   if (!currentUser) {
      return NextResponse.error();
   }

   //checking if image exists
   const foundImage = await prisma.productImage.findUnique({
      where: {
         id: id,
      },
   });

   if (!foundImage) {
      return NextResponse.json({success: false, message: 'No Image'});
   }

   // if the user is authorised to delete
   if (
      currentUser.email !== foundImage?.owner_email &&
      currentUser.role !== 'ADMIN'
   ) {
      return NextResponse.json({success: false, message: 'Not Authorized.'});
   }

   //before deleting the image from cloudinary replace the product primary image to another

   //get the product related to the image first
   const product = await prisma.product.findUnique({
      where: {
         id: foundImage.productId,
      },
      include: {
         productImages: {
            select: {
               id: true,
               public_id: true,
               url: true,
               productId: true,
               owner_email: true,
            },
         },
      },
   });

   //check if it is same image
   const imgExists = product?.productImage === foundImage.url;

   // filter out the image to be deleted
   const filteredImages: any = product?.productImages.filter(
      (img) => img.url !== foundImage.url,
   );

   if (imgExists === true) {
      //updating the newProduct
      await prisma.product.update({
         where: {
            id: product?.id,
         },
         data: {
            productImage: filteredImages.length > 0 && filteredImages[0].url,
         },
      });
   }

   //delete from cloudinary
   if (foundImage?.public_id) {
      await cloudinary.uploader.destroy(foundImage?.public_id);
   }

   //then delete from database
   await prisma.productImage.delete({
      where: {
         id: foundImage?.id,
      },
   });

   return NextResponse.json({success: true, message: 'Image deleted.'});
}
