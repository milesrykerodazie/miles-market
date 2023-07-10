import {NextResponse} from 'next/server';
import * as argon from 'argon2';

import prisma from '../../lib/prismadb';

export async function POST(request: Request) {
   const body = await request.json();
   const {name, email, username, password} = body;

   //checking if email already exists
   const emailExists = await prisma.user.findUnique({
      where: {
         email: email,
      },
   });

   //checking if email already exists
   const usernameExists = await prisma.user.findUnique({
      where: {
         username: username,
      },
   });

   if (emailExists)
      return NextResponse.json({
         success: false,
         message: 'Email Already Exists.',
      });
   if (usernameExists)
      return NextResponse.json({
         success: false,
         message: 'Username Already In Use.',
      });

   //encrypting password
   const hashedPassword = await argon.hash(password);

   const defaultImage =
      'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-0.jpg';

   const newUser = await prisma.user.create({
      data: {
         name,
         email,
         username,
         image: defaultImage,
         password: hashedPassword,
      },
   });

   if (newUser) {
      return NextResponse.json({
         success: true,
         message: `${newUser.username} registered successfully.`,
      });
   }
}
