import getCurrentUser from '@/app/actions/getCurrentUser';
import NewAddress from '@/app/components/user-profile/NewAddress';
import {Metadata} from 'next';
import React from 'react';
export const metadata: Metadata = {
   title: 'Admin-Dashboard | Add-Address',
};

const MyAddress = async () => {
   //get the current user
   const currentUser = await getCurrentUser();
   return (
      //@ts-expect-error
      <NewAddress role={currentUser?.role} />
   );
};

export default MyAddress;
