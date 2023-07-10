import React from 'react';
import UserProfile from '../components/user-profile/UserProfile';
import getCurrentUser from '../actions/getCurrentUser';

const UserDashboard = async () => {
   //get the current user
   const currentUser = await getCurrentUser();

   return (
      //@ts-expect-error
      <UserProfile userData={currentUser} />
   );
};

export default UserDashboard;
