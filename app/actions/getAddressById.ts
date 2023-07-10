import prisma from '../lib/prismadb';
import getCurrentUser from './getCurrentUser';

interface AddressParams {
   id?: string;
}

export default async function getAddressById(params: AddressParams) {
   //get current user
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return null;
   }
   try {
      const {id} = params;

      const address = await prisma.address.findUnique({
         where: {
            id: id,
         },
      });

      return address;
   } catch (error) {
      console.log(error);
   }
}
