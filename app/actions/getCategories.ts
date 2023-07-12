import prisma from '../lib/prismadb';

export default async function getCategories() {
   //getting the categories

   try {
      const getAllCategories = await prisma.category.findMany({
         orderBy: {
            categoryName: 'asc',
         },
      });

      if (getAllCategories.length === 0) {
         return null;
      }

      return getAllCategories;
   } catch (error) {
      console.log(error);
   }
}
