import prisma from '../lib/prismadb';

export default async function getAdminCats(
   searchQuery: {keyword?: string},
   userId: string | undefined,
) {
   //getting the categories

   try {
      // validate userId
      const validUser = await prisma.user.findUnique({
         where: {
            id: userId,
         },
      });

      if (!validUser) {
         return;
      }

      if (validUser?.role !== 'ADMIN') {
         return;
      }
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
