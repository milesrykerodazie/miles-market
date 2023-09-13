import prisma from "../lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getUserAddresses() {
  //getting the user currently logged in
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

  try {
    //getting the users addresses
    const userAddresses = await prisma.address.findMany({
      where: {
        userId: currentUser?.id,
      },
      select: {
        id: true,
        userId: true,
        country: true,
        state: true,
        city: true,
        street: true,
        phoneNo: true,
      },
    });

    // if (userAddresses.length === 0) {
    //    return;
    // }

    return userAddresses;
  } catch (error) {
    console.log(error);
  }
}
