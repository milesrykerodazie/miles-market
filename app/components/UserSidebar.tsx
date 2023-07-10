'use client';
import {signOut} from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const UserSideBar = ({password}: {password: any}) => {
   return (
      <aside className='hidden lg:inline-flex lg:w-1/4 px-4'>
         <ul className='sidebar'>
            <li>
               {' '}
               <Link
                  href='/user-dashboard'
                  className='block px-3 py-2 hover:bg-primary text-primary dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-md hover:text-white trans'
               >
                  My Profile
               </Link>
            </li>
            <li>
               {' '}
               <Link
                  href='/user-dashboard/address'
                  className='block px-3 py-2 hover:bg-primary text-primary dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-md hover:text-white trans'
               >
                  My Address Book
               </Link>
            </li>
            <li>
               {' '}
               <Link
                  href='/user-dashboard/my-orders'
                  className='block px-3 py-2 hover:bg-primary text-primary dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-md hover:text-white trans'
               >
                  Orders
               </Link>
            </li>
            <li>
               {' '}
               <Link
                  href='/user-dashboard/update-profile'
                  className='block px-3 py-2 hover:bg-primary text-primary dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-md hover:text-white trans'
               >
                  Update Profile
               </Link>
            </li>
            {password && (
               <li>
                  {' '}
                  <Link
                     href='/user-dashboard/update-password'
                     className='block px-3 py-2 hover:bg-primary text-primary dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-md hover:text-white trans'
                  >
                     Update Password
                  </Link>
               </li>
            )}

            <li>
               <span
                  onClick={(e) => {
                     e.preventDefault();
                     signOut();
                  }}
                  className='block px-3 py-2 text-red-800 hover:bg-red-400 hover:text-white rounded-md cursor-pointer'
               >
                  Logout
               </span>
            </li>
         </ul>
      </aside>
   );
};

export default UserSideBar;
