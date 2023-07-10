import getUserAddresses from '@/app/actions/getUserAddresses';
import getCurrentUser from '../../actions/getCurrentUser';
import AddressList from '@/app/components/user-profile/AddressList';

export const metadata: Metadata = {
   title: 'User-Dashboard | Addresses',
};
import React from 'react';
import {Metadata} from 'next';

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
