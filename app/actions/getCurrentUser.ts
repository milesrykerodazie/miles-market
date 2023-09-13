import { getServerSession } from "next-auth";
import prisma from "../lib/prismadb";
import { authOptions } from "../lib/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

//getting the current user
export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        profilePic: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        password: true,
      },
    });

    if (!currentUser) {
      return null;
    }

    console.log("the current user => ", currentUser);

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error) {}
}
