import {UserType} from '@prisma/client';
import prisma from '../lib/prismadb';

export default async function getAllOrders(
   role: UserType | undefined,
   id: string | undefined,
   searchQuery: {
      keyword?: string;
   },
) {
   try {
      //    validate the user
      const validUser = await prisma.user.findUnique({
         where: {
            id: id,
         },
      });

      if (!validUser) {
         return null;
      }

      //making sure only valid users who are admin can see all orders
      if (role !== validUser?.role) {
         return null;
      }

      const authorized = role === validUser?.role;

      //getting all the orders
      if (authorized) {
         //getting the query keyword
         const {keyword} = searchQuery;
         let query: any = {};

         if (keyword) {
            query.orderId = {
               contains: keyword,
               mode: 'insensitive',
            };
         }

         const orders = await prisma.order.findMany({
            where: query,
            include: {
               shippingInfo: {
                  select: {
                     country: true,
                     phoneNo: true,
                     state: true,
                     city: true,
                     street: true,
                  },
               },
               user: {
                  select: {
                     name: true,
                     email: true,
                  },
               },
               orderItems: {
                  select: {
                     name: true,
                     quantity: true,
                     image: true,
                     price: true,
                  },
               },
               paymentInfo: {
                  select: {
                     status: true,
                     taxPaid: true,
                     amountPaid: true,
                  },
               },
            },
            orderBy: {
               createdAt: 'desc',
            },
         });

         return orders;
      }

      if (!authorized) {
         return 'Unauthorized.';
      }
   } catch (error) {
      console.log(error);
   }
}
