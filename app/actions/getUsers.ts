import {UserType} from '@prisma/client';
import prisma from '../lib/prismadb';
import {SafeUser} from '../types';

export default async function getUsers(
   userRole: UserType | undefined,
   searchQuery: {
      keyword?: string;
   },
) {
   if (userRole !== 'ADMIN') {
      return null;
   }

   try {
      //getting the query keyword
      const {keyword} = searchQuery;

      let query: any = {};

      if (keyword) {
         query.name = {
            contains: keyword,
            mode: 'insensitive',
         };
      }

      //get all users
      const users = await prisma.user.findMany({
         where: query,
         include: {
            profilePic: {
               select: {
                  id: true,
                  public_id: true,
                  url: true,
               },
            },
         },
         orderBy: {
            name: 'asc',
         },
      });

      if (!users) {
         return null;
      }

      //refactoring the users and making the date frontend friendly
      const safeUsersData = users.map((user) => ({
         ...user,
         createdAt: user.createdAt.toISOString(),
         updatedAt: user.updatedAt.toISOString(),
      }));

      return safeUsersData;
   } catch (error) {
      console.log(error);
   }
}
