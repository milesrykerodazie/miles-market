import {NextResponse, NextRequest} from 'next/server';
import prisma from '../../../lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req: NextRequest) {
   // Get current user
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error();
   }

   try {
      // Request body
      const body = await req.json();

      // Check if the product exists
      const foundProduct = await prisma.product.findUnique({
         where: {
            id: body.productId,
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
            comments: true,
         },
      });

      // If no product
      if (!foundProduct) {
         return NextResponse.json({
            success: false,
            message: 'No product found.',
         });
      }

      // Check if the user has reviewed this
      const isReviewed = foundProduct?.comments?.find(
         (review) => review.userId === currentUser?.id,
      );

      if (!isReviewed) {
         const newReview = await prisma.comment.create({
            data: {
               userId: currentUser?.id,
               productId: foundProduct?.id,
               rating: body?.rating,
               comment: body?.comment,
            },
         });

         // Get the latest updated product
         const newProductUpdate = await prisma.product.findUnique({
            where: {
               id: newReview?.productId,
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
               comments: true,
            },
         });

         // Work on the average rating
         if (newProductUpdate) {
            const productRating =
               newProductUpdate?.comments?.reduce(
                  (acc, review) => review.rating + acc,
                  0,
               ) / newProductUpdate?.comments.length;

            const roundRating = Math.floor(productRating + 0.5);

            // Update the product
            await prisma.product.update({
               where: {
                  id: newProductUpdate.id,
               },
               data: {
                  ratings: productRating,
                  roundedRating: roundRating,
               },
            });
         }
         return NextResponse.json({success: true, message: 'Review added!'});
      }

      if (isReviewed) {
         // update review
         const updatedReview = await prisma.comment.update({
            where: {
               id: isReviewed?.id,
            },
            data: {
               rating: body?.rating ? body?.rating : isReviewed?.rating,
               comment: body?.comment ? body?.comment : isReviewed?.comment,
            },
         });

         // Get the latest updated product
         const newProductUpdate = await prisma.product.findUnique({
            where: {
               id: updatedReview?.productId,
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
               comments: true,
            },
         });

         // Work on the average rating
         if (newProductUpdate) {
            const productRating =
               newProductUpdate?.comments?.reduce(
                  (acc, review) => review.rating + acc,
                  0,
               ) / newProductUpdate?.comments.length;

            const roundRating = Math.floor(productRating + 0.5);

            // Update the product
            await prisma.product.update({
               where: {
                  id: newProductUpdate.id,
               },
               data: {
                  ratings: productRating,
                  roundedRating: roundRating,
               },
            });
         }
         return NextResponse.json({success: true, message: 'Review updated!'});
      }
   } catch (error) {
      console.error('Error:', error);
      return NextResponse.error();
   }
}
