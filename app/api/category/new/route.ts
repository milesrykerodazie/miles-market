import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse, NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
   //getting the current user from server
   const currentUser = await getCurrentUser();

   //check if there is a user and if the user is an admin

   if (!currentUser) {
      return NextResponse.error();
   }

   if (currentUser?.role !== 'ADMIN') {
      return NextResponse.json({success: false, message: 'Unauthorized'});
   }

   const body = await req.json();

   //convert then text to lowercase
   const catName = body.categoryName.toLowerCase();

   //check id the category exists
   const catExists = await prisma?.category.findUnique({
      where: {
         categoryName: catName,
      },
   });

   if (catExists) {
      return NextResponse.json({
         success: false,
         message: 'Category already exists.',
      });
   }

   //creating the category name
   await prisma?.category.create({
      data: {
         categoryName: catName,
      },
   });

   return NextResponse.json({
      success: true,
      message: 'Category created successfully.',
   });
}
