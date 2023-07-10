import {NextRequest, NextResponse} from 'next/server';
import prisma from '../../../lib/prismadb';

export async function GET(req: NextRequest) {
   //get all products
   const products = await prisma.product.findMany({
      orderBy: {
         createdAt: 'desc',
      },
   });

   //refactoring the products created at
   const safeProducts = products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toString(),
      updatedAt: product.updatedAt.toString(),
   }));

   return NextResponse.json({message: 'All products', safeProducts});
}
