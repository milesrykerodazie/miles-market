import prisma from '../lib/prismadb';

export default async function getProducts(searchOuery: {
   keyword?: string;
   category?: string;
   ratings?: number;
   min?: string;
   max?: string;
}) {
   try {
      const {keyword, min, max, category, ratings} = searchOuery;
      // convert min and max to float values
      const newMax = parseFloat(max!);
      const newMin = parseFloat(min!);

      let query: any = {};

      if (keyword) {
         query.OR = [
            {name: {contains: keyword, mode: 'insensitive'}},
            {description: {contains: keyword, mode: 'insensitive'}},
         ];
      }

      if (min && max) {
         query.price = {
            gte: newMin,
            lte: newMax,
         };
      } else if (min) {
         query.price = {
            gte: newMin,
         };
      } else if (max) {
         query.price = {
            lte: newMax,
         };
      }

      if (category) {
         query.category = category;
      }

      if (ratings) {
         query.ratings = Math.round(ratings);
      }
      //get all products with search query
      const products = await prisma.product.findMany({
         where: query,
         include: {
            productImages: {
               select: {
                  public_id: true,
                  url: true,
                  productId: true,
               },
            },
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      if (!products) {
         return null;
      }
      //refactoring the products created at
      const safeProducts = products.map((product) => ({
         ...product,
         createdAt: product.createdAt.toISOString(),
      }));

      return safeProducts;
   } catch (error: any) {}
}
