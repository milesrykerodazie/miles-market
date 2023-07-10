'use client';

import {SafeUser} from '@/app/types';
import Link from 'next/link';
import React, {FC} from 'react';
import {MdOutlineAdminPanelSettings} from 'react-icons/md';

interface DashboardProps {
   currentUser?: SafeUser | null;
}

const Dashboard: FC<DashboardProps> = ({currentUser}) => {
   return (
      <>
         {currentUser && currentUser.role === 'ADMIN' ? (
            <Link
               href='/admin-dashboard'
               className='px-3 py-2 text-center text-white dark:text-primary bg-primary border border-primary rounded-md hover:bg-primary/80 dark:bg-white flex items-center space-x-2 trans'
            >
               <MdOutlineAdminPanelSettings />
               <span className='hidden lg:inline ml-1'>Dashboard</span>
            </Link>
         ) : currentUser?.role === 'USER' ? (
            <Link
               href='/user-dashboard'
               className='px-3 py-2 text-center text-white dark:text-primary bg-primary border border-primary rounded-md hover:bg-primary/80 dark:bg-white flex items-center space-x-2 trans'
            >
               <MdOutlineAdminPanelSettings />
               <span className='hidden lg:inline ml-1'>Dashboard</span>
            </Link>
         ) : null}
      </>
   );
};

export default Dashboard;
