import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../lib/prismadb';
import slugify from 'slugify';
import {v2 as cloudinary} from 'cloudinary';
import getCurrentUser from '@/app/actions/getCurrentUser';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_KEY_SECRET,
});

export async function POST(req: NextRequest) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error;
   }

   const body = await req.json();

   //generate product slug
   const options = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: false,
      locale: 'en',
      trim: true,
   };
   const productSlug = slugify(body.name, options);

   //check if product slug already exists
   const prdSlugExists = await prisma.product.findUnique({
      where: {
         slug: productSlug,
      },
   });

   if (prdSlugExists) {
      return NextResponse.json(
         {error: 'Product of same name, update stock instead.'},
         {status: 409},
      );
   }

   //create the new product
   const newProduct = await prisma.product.create({
      data: {
         name: body.name,
         slug: productSlug,
         description: body.description,
         price: body.price,
         category: body.category,
         seller: body.seller,
         stock: body.stock,
         owner_id: currentUser.id,
      },
   });

   //uploading images to cloudinary

   if (newProduct) {
      //uploading images
      const uploadedImages = await Promise.all(
         body.productImages.map((image: any) =>
            cloudinary.uploader.upload(image, {folder: 'marketImages'}),
         ),
      );

      //preparing the product images
      const productImages = uploadedImages.map((image) => {
         return {
            productId: newProduct.id as string,
            public_id: image.public_id as string,
            url: image.secure_url as string,
            owner_email: currentUser.email as string,
         };
      });

      //updating the newProduct
      const completeProduct = await prisma.product.update({
         where: {
            id: newProduct.id,
         },
         data: {
            productImage: productImages[0].url,
         },
      });

      //creating all product images
      await prisma.productImage.createMany({
         data: productImages,
      });

      return NextResponse.json({
         success: true,
         message: 'Product Added.',
      });
   }
}
