import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../../lib/prismadb';
import slugify from 'slugify';
import {v2 as cloudinary} from 'cloudinary';
import getCurrentUser from '@/app/actions/getCurrentUser';

// Configure Cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_KEY,
   api_secret: process.env.CLOUD_KEY_SECRET,
});

interface SlugParams {
   slug: string;
}

export async function PATCH(req: NextRequest, {params}: {params: SlugParams}) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   //getting the params
   const {slug} = params;

   const body = await req.json();

   //check if the product exists
   const foundProduct = await prisma.product.findUnique({
      where: {
         slug: slug,
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

   if (!foundProduct) {
      return NextResponse.json({
         success: false,
         message: 'Product does not exist.',
      });
   }

   //check if the current user is the owner of the product
   if (currentUser.username !== foundProduct.seller) {
      return NextResponse.json({success: false, message: 'Not authorized.'});
   }

   const options = {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: false,
      locale: 'en',
      trim: true,
   };

   //check if product image url does not exist
   const imgExists = foundProduct.productImages.filter(
      (img) => img.url === foundProduct.productImage,
   );

   //checking if product name is the same
   const newProductName = foundProduct.name === body?.name;
   const productSlug = slugify(body.name, options);

   //check if product slug already exists

   if (newProductName === false) {
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
   }

   //fixing the product slug
   const productSlugUpdate =
      newProductName === true ? foundProduct.slug : productSlug;

   //updating products if there is an image or images or no image at all

   if (body?.productImages.length > 0) {
      //do the update with pictures here
      if (foundProduct.productImages.length + body?.productImages.length > 5) {
         return NextResponse.json({
            success: false,
            message: 'Images can not be more than 5 for a product.',
         });
      }

      //update the product
      const updatedPrd = await prisma.product.update({
         where: {
            slug: foundProduct.slug,
         },
         data: {
            name: body.name,
            slug: productSlugUpdate,
            description: body.description,
            price: body.price,
            category: body.category,
            seller: body.seller,
            stock: body.stock,
            owner_id: currentUser.id,
         },
      });

      //uploading the images
      if (updatedPrd) {
         //uploading images
         const uploadedImages = await Promise.all(
            body.productImages.map((image: any) =>
               cloudinary.uploader.upload(image, {folder: 'marketImages'}),
            ),
         );

         //preparing the product images
         const productImages = uploadedImages.map((image) => {
            return {
               productId: updatedPrd.id as string,
               public_id: image.public_id as string,
               url: image.secure_url as string,
               owner_email: currentUser.email as string,
            };
         });

         //updating the newProduct
         if (imgExists.length !== 0) {
            await prisma.product.update({
               where: {
                  id: updatedPrd.id,
               },
               data: {
                  productImage: foundProduct.productImages
                     ? foundProduct.productImages[0].url
                     : productImages[0].url,
               },
            });
         }

         //creating all product images
         await prisma.productImage.createMany({
            data: productImages,
         });

         return NextResponse.json({
            success: true,
            message: `The Product Updated Successfully.`,
         });
      }
   } else {
      //do the update without pictures here
      const updatedPrd = await prisma.product.update({
         where: {
            slug: foundProduct.slug,
         },
         data: {
            name: body.name,
            slug: productSlugUpdate,
            description: body.description,
            price: body.price,
            category: body.category,
            seller: body.seller,
            stock: body.stock,
            owner_id: currentUser.id,
         },
      });

      return NextResponse.json({
         success: true,
         message: `The Product without image Updated Successfully.`,
      });
   }
}
