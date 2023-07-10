import getCurrentUser from '@/app/actions/getCurrentUser';
import getUserAddresses from '@/app/actions/getUserAddresses';
import AddressList from '@/app/components/user-profile/AddressList';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Addresses',
};

const MyAddress = async () => {
   //get the current user
   const currentUser = await getCurrentUser();

   //user addresses
   const addresses = await getUserAddresses();
   return (
      //@ts-expect-error
      <AddressList role={currentUser?.role} addresses={addresses} />
   );
};

export default MyAddress;
