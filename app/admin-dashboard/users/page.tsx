import getCurrentUser from '@/app/actions/getCurrentUser';
import getUsers from '@/app/actions/getUsers';
import MiniSearch from '@/app/components/admin/MiniSearch';
import Users from '@/app/components/admin/Users';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | All-Users',
};

interface UserSearchProps {
   searchParams: {
      keyword: string;
   };
}

const AllUsers = async ({searchParams}: UserSearchProps) => {
   //current User
   const currentUser = await getCurrentUser();
   //user role
   const userRole = currentUser?.role;
   //the users
   const users = await getUsers(userRole, searchParams);

   return (
      //
      <>
         <MiniSearch />
         {/* @ts-expect-error */}
         <Users users={users} />
      </>
   );
};

export default AllUsers;
