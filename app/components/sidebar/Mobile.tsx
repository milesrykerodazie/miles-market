import {signOut} from 'next-auth/react';
import Link from 'next/link';
import React, {FC} from 'react';
import {MdClose} from 'react-icons/md';

interface MobileTypes {
   navMobile: boolean;
   setNavMobile: React.Dispatch<React.SetStateAction<boolean>>;
   password: any;
}

const Mobile: FC<MobileTypes> = ({navMobile, setNavMobile, password}) => {
   return (
      <div
         className={
            navMobile
               ? 'lg:hidden fixed left-0 top-0 w-full h-screen bg-primary/90 z-80 ease-in-out duration-700'
               : 'lg:hidden fixed -left-[100%] top-0 w-full h-screen bg-primary/60 z-80 ease-in-out duration-900'
         }
         onClick={() => setNavMobile((current: any) => !current)}
      >
         <div
            className={
               navMobile
                  ? 'fixed top-0 left-0 h-screen bg-main bg-primary shadow-xl shadow-white w-[80%] md:w-[70%] ease-in duration-900 z-80 pt-3 px-3'
                  : 'fixed -left-[100%] top-0 ease-in duration-700 bg-primary/95 shadow-xl shadow-white w-[80%] md:w-[70%] h-screen z-80 pt-3 px-3'
            }
            onClick={(e) => e.stopPropagation()}
         >
            <div className='flex items-center justify-between pt-3 px-2'>
               <h3 className='font-semibold text-white'>Dashboard Menu</h3>
               <div
                  onClick={() => setNavMobile((current: any) => !current)}
                  className='flex items-center justify-center rounded-full w-7 h-7 bg-white'
               >
                  <MdClose className='w-5 h-5 text-primary' />
               </div>
            </div>
            <hr className='my-2' />
            <div>
               <ul className=''>
                  <>
                     <li>
                        {' '}
                        <Link
                           href='/admin-dashboard/products/new'
                           className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                           onClick={() => setNavMobile(false)}
                        >
                           New Product
                           <span className='text-red-500'>(Admin)</span>
                        </Link>
                     </li>

                     <li>
                        {' '}
                        <Link
                           href='/admin-dashboard'
                           className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                           onClick={() => setNavMobile(false)}
                        >
                           All Products{' '}
                           <span className='text-red-500'>(Admin)</span>
                        </Link>
                     </li>

                     <li>
                        {' '}
                        <Link
                           href='/admin-dashboard/orders/all-orders'
                           className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                           onClick={() => setNavMobile(false)}
                        >
                           All Orders{' '}
                           <span className='text-red-500'>(Admin)</span>
                        </Link>
                     </li>

                     <li>
                        {' '}
                        <Link
                           href='/admin-dashboard/users'
                           className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                           onClick={() => setNavMobile(false)}
                        >
                           All Users{' '}
                           <span className='text-red-500'>(Admin)</span>
                        </Link>
                     </li>

                     <hr className='my-2' />
                  </>

                  <li>
                     {' '}
                     <Link
                        href='/admin-dashboard/my-profile'
                        className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                        onClick={() => setNavMobile(false)}
                     >
                        My Profile
                     </Link>
                  </li>
                  <li>
                     {' '}
                     <Link
                        href='/admin-dashboard/address'
                        className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                        onClick={() => setNavMobile(false)}
                     >
                        My Address Book
                     </Link>
                  </li>
                  <li>
                     {' '}
                     <Link
                        href='/admin-dashboard/my-orders'
                        className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                        onClick={() => setNavMobile(false)}
                     >
                        Orders
                     </Link>
                  </li>
                  <li>
                     {' '}
                     <Link
                        href='/admin-dashboard/update-profile'
                        className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                        onClick={() => setNavMobile(false)}
                     >
                        Update Profile
                     </Link>
                  </li>
                  {password && (
                     <li>
                        {' '}
                        <Link
                           href='/admin-dashboard/update-password'
                           className='block px-3 py-2 text-white dark:hover:bg-white rounded-md trans'
                           onClick={() => setNavMobile(false)}
                        >
                           Update Password
                        </Link>
                     </li>
                  )}

                  <li>
                     {' '}
                     <span
                        onClick={(e) => {
                           e.preventDefault();
                           setNavMobile(false);
                           signOut();
                        }}
                        className='block px-3 py-2 text-red-600 hover:bg-red-400 hover:text-white rounded-md cursor-pointer'
                     >
                        Logout
                     </span>
                  </li>
               </ul>
            </div>
         </div>
      </div>
   );
};

export default Mobile;
