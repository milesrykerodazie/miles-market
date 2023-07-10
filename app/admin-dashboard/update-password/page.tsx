import PasswordUpdate from '@/app/components/user-profile/PasswordUpdate';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Update-Password',
};

const UpdatePassword = async () => {
   return <PasswordUpdate />;
};

export default UpdatePassword;
