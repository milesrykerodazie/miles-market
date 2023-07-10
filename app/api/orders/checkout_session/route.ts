import {NextRequest, NextResponse} from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Stripe from 'stripe';
import {stripe} from '@/app/lib/stripe';

interface CartItem {
   productId: string;
   name: string;
   slug: string;
   price: number;
   productImage: string;
   stock: number;
   seller: string;
   quantity: number;
}

export async function POST(req: NextRequest) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return NextResponse.error;
   }
   //the request sent
   const body = await req.json();

   //sending the line items in proper stripe types
   const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

   //working on formating data for stripe

   body?.items?.forEach((item: any) => {
      line_items.push({
         price_data: {
            currency: 'USD',
            product_data: {
               name: item.name,
               images: [item.productImage],
               metadata: {
                  productId: item.productId,
                  productSlug: item.slug,
                  productOwner: item.seller,
               },
            },
            unit_amount: Math.round(item.price * 100),
         },
         tax_rates: ['txr_1NSQJSA4md0CohnanDbBXy9O'],
         quantity: item.quantity,
      });
   });

   const shippingInfo = body?.shippingInfo;

   //the session creation
   const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: 'http://localhost:3000/order-complete?success=true',
      cancel_url: 'http://localhost:3000',
      customer_email: currentUser?.email!,
      client_reference_id: currentUser?.id,
      mode: 'payment',
      metadata: {shippingInfo},
      shipping_options: [
         {
            shipping_rate: 'shr_1NSQHbA4md0CohnappFJMh7X',
         },
      ],
      line_items,
   });

   if (session?.id) {
      // console.log('stripe session response => ', session);
      return NextResponse.json({success: true, url: session?.url});
   } else {
      return NextResponse.error();
   }
}
