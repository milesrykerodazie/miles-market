import prisma from '../lib/prismadb';

export default async function getUserOrders(userId: string) {
   try {
      //check if user is valid
      const validUser = await prisma.user.findUnique({
         where: {
            id: userId,
         },
      });

      if (!validUser) {
         return null;
      }

      //get user orders
      const userOrders = await prisma.order.findMany({
         where: {
            userId: validUser?.id,
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
                  slug: true,
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

      if (userOrders?.length > 0) {
         return userOrders;
      }
   } catch (error) {
      console.log(error);
   }
}
