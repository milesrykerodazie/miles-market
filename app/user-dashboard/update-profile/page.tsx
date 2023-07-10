import getCurrentUser from '@/app/actions/getCurrentUser';
import EditProfile from '@/app/components/user-profile/EditProfile';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'User-Dashboard | Update-Profile',
};

import React from 'react';

const UpdateMyProfile = async () => {
   //get the current user
   const currentUser = await getCurrentUser();
   return (
      //@ts-expect-error
      <EditProfile userData={currentUser} />
   );
};

export default UpdateMyProfile;
