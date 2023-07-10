import prisma from '../lib/prismadb';

interface ProductParams {
   slug?: string;
}

export default async function getProductById(params: ProductParams) {
   try {
      const {slug} = params;

      const product = await prisma.product.findUnique({
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
            comments: {
               select: {
                  id: true,
                  userId: true,
                  owner: {
                     select: {
                        image: true,
                        name: true,
                     },
                  },
                  rating: true,
                  comment: true,
                  productId: true,
                  createdAt: true,
               },
            },
         },
      });

      if (!product) {
         return null;
      }

      const safeProduct = {
         ...product,
         createdAt: product.createdAt.toISOString(),
      };

      return safeProduct;
   } catch (error: any) {
      console.log(error);
   }
}
