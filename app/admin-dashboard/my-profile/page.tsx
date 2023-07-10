import getCurrentUser from '@/app/actions/getCurrentUser';
import UserProfile from '@/app/components/user-profile/UserProfile';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | My-Profile',
};

const AdminProfile = async () => {
   //get the current user
   const currentUser = await getCurrentUser();

   return (
      //@ts-expect-error
      <UserProfile userData={currentUser} />
   );
};

export default AdminProfile;
