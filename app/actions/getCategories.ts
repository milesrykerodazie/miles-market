import prisma from '../lib/prismadb';

export default async function getCategories(searchQuery: {keyword?: string}) {
   //getting the categories

   try {
      //getting the query keyword
      const {keyword} = searchQuery;
      let query: any = {};

      if (keyword) {
         query.categoryName = {
            contains: keyword,
            mode: 'insensitive',
         };
      }

      const getAllCategories = await prisma.category.findMany({
         where: query,
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
