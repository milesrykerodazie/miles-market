import getCurrentUser from '@/app/actions/getCurrentUser';
import EditProfile from '@/app/components/user-profile/EditProfile';
import {Metadata} from 'next';
import React from 'react';
export const metadata: Metadata = {
   title: 'Admin-Dashboard | Update-Profile',
};

const UpdateMyProfile = async () => {
   //get the current user
   const currentUser = await getCurrentUser();
   return (
      //@ts-expect-error
      <EditProfile userData={currentUser} />
   );
};

export default UpdateMyProfile;
