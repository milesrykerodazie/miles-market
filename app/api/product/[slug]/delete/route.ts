import {NextResponse, NextRequest} from 'next/server';
import {v2 as cloudinary} from 'cloudinary';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '../../../../lib/prismadb';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_KEY_SECRET,
});

interface SlugParams {
   slug: string;
}

export async function DELETE(req: NextRequest, {params}: {params: SlugParams}) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   const slug = params.slug;

   console.log('the id => ', slug);

   if (!currentUser) {
      return NextResponse.error();
   }

   //check if the product exists
   const foundProduct = await prisma.product.findUnique({
      where: {
         slug: slug,
      },
   });

   if (!foundProduct) {
      return NextResponse.json({
         success: false,
         message: 'Product does not exist.',
      });
   }

   console.log('the found product => ', foundProduct);

   //check if the current user is the owner of the product
   if (currentUser?.username !== foundProduct?.seller) {
      return NextResponse.json({success: false, message: 'Not authorized.'});
   }

   //check if product has images
   const productImg = await prisma.productImage.findMany({
      where: {
         productId: foundProduct?.id,
      },
   });

   //delete all images from cloudinary
   if (productImg?.length > 0) {
      await Promise.all(
         productImg.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );
   }

   //delete images from database
   await prisma.productImage.deleteMany({
      where: {
         productId: foundProduct?.id,
      },
   });

   //delete the product
   await prisma.product.delete({
      where: {
         id: foundProduct?.id,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'Product deleted successfully..',
   });
}
