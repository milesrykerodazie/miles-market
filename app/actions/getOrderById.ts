import {UserType} from '@prisma/client';
import prisma from '../lib/prismadb';

interface OrderParams {
   id: string;
}

export default async function getOrder(
   params: OrderParams,
   role: UserType | undefined,
   userId: string | undefined,
) {
   try {
      //get the params
      const {id} = params;

      //    validate the user
      const validUser = await prisma.user.findUnique({
         where: {
            id: userId,
         },
      });

      if (!validUser) {
         return null;
      }

      //making sure only valid users who are admin can see all orders
      if (role !== validUser?.role) {
         return null;
      }

      //validate the order id
      const validOrder = await prisma.order.findUnique({
         where: {
            id: id,
         },
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
      });

      if (!validOrder) {
         return null;
      }

      const authorized = role === validUser?.role;

      if (authorized) {
         return validOrder;
      }
   } catch (error) {
      console.log(error);
   }
}
