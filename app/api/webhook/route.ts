import Stripe from 'stripe';
import {headers} from 'next/headers';
import {NextResponse, NextRequest} from 'next/server';
import {stripe} from '@/app/lib/stripe';
import prisma from '@/app/lib/prismadb';

interface OrderType {
   orderId: string;
   productId: string;
   name: string;
   slug: string;
   seller: string;
   quantity: number;
   image: string;
   price: any;
}

export async function POST(req: Request) {
   const body = await req.text();
   const signature = headers().get('Stripe-Signature') as string;

   try {
      const event: Stripe.Event = stripe.webhooks.constructEvent(
         body,
         signature,
         process.env.STRIPE_WEBHOOK_SECRET!,
      );
      const session = event.data.object as Stripe.Checkout.Session;
      const amountPaid: any = session.amount_total! / 100;
      const tax: any = session.total_details?.amount_tax! / 100;

      if (event.type === 'checkout.session.completed') {
         const line_items = await stripe.checkout.sessions.listLineItems(
            session.id,
         );

         //create the order
         const newOrder = await prisma.order.create({
            data: {
               shippingInfoId: session?.metadata?.shippingInfo as string,
               userId: session?.client_reference_id as string,
            },
         });

         //getting the orderitems in the right format
         const orderItems = (await getCartItems(
            line_items,
            newOrder?.id,
         )) as OrderType[];

         //saving all in the database
         if (orderItems) {
            await Promise.all(
               orderItems?.map(async (orderItem) => {
                  await prisma.orderItem.create({
                     data: {
                        orderId: orderItem?.orderId,
                        productId: orderItem?.productId,
                        name: orderItem?.name,
                        slug: orderItem?.slug,
                        seller: orderItem?.seller,
                        price: orderItem?.price,
                        quantity: orderItem?.quantity,
                        image: orderItem?.image,
                     },
                  });
               }),
            );
         }

         //the payment info
         const newPaymentInfo = await prisma.paymentInfo.create({
            data: {
               status: session.payment_status,
               amountPaid: amountPaid,
               taxPaid: tax,
               orderId: newOrder?.id,
            },
         });

         //update the new order
         await prisma.order.update({
            where: {
               id: newOrder?.id,
            },
            data: {
               paymentInfoId: newPaymentInfo?.id,
               orderId: newOrder?.id,
            },
         });

         return NextResponse.json('Added items');
      }
   } catch (error) {
      return NextResponse.json({
         success: false,
         message: 'Payment Not successful',
      });
   }
}

//get Items function to help format the order items correctly
async function getCartItems(line_items: any, orderid: string) {
   return new Promise((resolve, rject) => {
      let cartItems: OrderType[] = [];

      line_items?.data?.forEach(async (item: any) => {
         const product = await stripe.products.retrieve(item.price.product);
         const productId = product.metadata.productId;
         const productSlug = product.metadata.productSlug;
         const productOwner = product.metadata.productOwner;

         cartItems.push({
            orderId: orderid,
            productId: productId,
            name: product.name,
            slug: productSlug,
            seller: productOwner,
            quantity: item.quantity,
            image: product.images[0],
            price: item.price.unit_amount_decimal / 100,
         });

         if (cartItems.length === line_items?.data.length) {
            resolve(cartItems);
         }
      });
   });
}
