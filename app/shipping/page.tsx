import React from 'react';
import getUserAddresses from '../actions/getUserAddresses';
import Shipping from '../components/shipping/Shipping';
import getCurrentUser from '../actions/getCurrentUser';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'Shipping',
};

const ShippingPage = async () => {
   //get the current user
   const currentUser = await getCurrentUser();
   //get the users addresses
   const userAddresses = await getUserAddresses();

   //getting the addresses of the user
   return (
      //@ts-expect-error
      <Shipping userAddresses={userAddresses} role={currentUser?.role} />
   );
};

export default ShippingPage;
