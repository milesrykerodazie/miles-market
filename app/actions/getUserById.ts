import {UserType} from '@prisma/client';
import prisma from '../lib/prismadb';

interface UserParams {
   id: string;
}

export default async function getUserById(
   params: UserParams,
   userRole: UserType | undefined,
) {
   if (userRole !== 'ADMIN') {
      return null;
   }
   try {
      const {id} = params;

      const user = await prisma.user.findUnique({
         where: {
            id: id,
         },
         select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
            profilePic: {
               select: {
                  id: true,
                  public_id: true,
                  url: true,
               },
            },
            role: true,
            createdAt: true,
            updatedAt: true,
         },
      });

      if (!user) {
         return null;
      }

      const safeUser = {
         ...user,
         createdAt: user.createdAt.toISOString(),
         updatedAt: user.updatedAt.toISOString(),
      };

      return safeUser;
   } catch (error) {}
}
