import prisma from '../lib/prismadb';

interface ReviewParams {
   slug: string;
}

export default async function getCanReview(
   params: ReviewParams,
   userId: string | undefined,
) {
   const slug = params?.slug;
   // validate all params

   try {
      const productIsValid = await prisma.product.findUnique({
         where: {
            slug: slug,
         },
      });

      if (!productIsValid) {
         return null;
      }

      const userIsValid = await prisma.user.findUnique({
         where: {
            id: userId,
         },
      });

      if (!userIsValid) {
         return null;
      }

      const orders = await prisma.order.findMany({
         where: {
            userId: userIsValid?.id,
            orderItems: {
               some: {
                  productId: productIsValid?.id,
               },
            },
         },
      });

      const canReview = orders?.length >= 1 ? true : false;

      return canReview;
   } catch (error) {
      console.log(error);
   }
}
