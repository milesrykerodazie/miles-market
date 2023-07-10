import getCurrentUser from '@/app/actions/getCurrentUser';
import getUserById from '@/app/actions/getUserById';
import EditUser from '@/app/components/admin/EditUser';
import {Metadata} from 'next';
import React from 'react';
export const metadata: Metadata = {
   title: 'Admin-Dashboard | Update-User-Role',
};

interface UserParams {
   id: string;
}

const roles = [
   {id: '001', role: 'ADMIN'},
   {id: '002', role: 'USER'},
];

const AdminEditUser = async ({params}: {params: UserParams}) => {
   //current User
   const currentUser = await getCurrentUser();
   //user role
   const userRole = currentUser?.role;
   //the users
   const userData = await getUserById(params, userRole);
   return (
      //@ts-expect-error
      <EditUser userData={userData} roles={roles} />
   );
};

export default AdminEditUser;
