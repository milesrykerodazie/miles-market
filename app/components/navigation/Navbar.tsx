'use client';
import React, {FC, useState} from 'react';
import {SafeUser} from '../../types';
import UseMenu from './UseMenu';
import Logo from '../Logo';
import ThemeMode from './ThemeMode';
import Search from './Search';
import Cart from './Cart';
import Dashboard from './Dashboard';
import {BsFillCartCheckFill, BsSearch} from 'react-icons/bs';
import {TiThMenu} from 'react-icons/ti';
import {useAppSelector} from '@/app/state-management/hooks';
import {selectCartItems} from '@/app/state-management/features/cartSlice';
import Link from 'next/link';
import {MdOutlineClose} from 'react-icons/md';
import {AiFillCloseCircle} from 'react-icons/ai';
import MobileNav from '../sidebar/MobileNav';

interface NavbarProps {
   currentUser?: SafeUser | null;
}

const Navbar: FC<NavbarProps> = ({currentUser}) => {
   //getting the cartItems
   const cartItems = useAppSelector(selectCartItems);
   const [openSearch, setOpenSearch] = useState(false);
   const [navMobile, setNavMobile] = useState(false);
   return (
      <div className='fixed w-full bg-white dark:bg-primary z-50 shadow-md shadow-primary dark:shadow-white trans'>
         <div className='p-3 lg:px-10'>
            <div className='hidden lg:inline-flex w-full items-center justify-between gap-3'>
               <Logo />
               <Search />
               <ThemeMode />
               <Cart />
               <Dashboard currentUser={currentUser} />
               <UseMenu currentUser={currentUser} />
            </div>
            <div className='lg:hidden'>
               {openSearch ? (
                  <div className='flex items-center space-x-2'>
                     <AiFillCloseCircle
                        onClick={() => setOpenSearch(false)}
                        className=' text-primary dark:text-white w-5 h-5 trans'
                     />
                     <div className='w-[95%]'>
                        <Search />
                     </div>
                  </div>
               ) : (
                  <div className='flex flex-row items-center justify-between gap-3 trans'>
                     <div className='flex items-center space-x-4'>
                        <TiThMenu
                           onClick={() => setNavMobile(true)}
                           className='text-primary dark:text-white trans w-5 h-5 select-none'
                        />
                        <Logo />
                     </div>
                     <ThemeMode />

                     <Link
                        href='/cart'
                        className='px-3 py-2 text-primary dark:text-white trans relative'
                     >
                        <BsFillCartCheckFill className='w-5 h-5' />

                        <span className='absolute -top-1.5 right-1 font-semibold text-primary dark:text-white trans'>
                           {cartItems?.length}
                        </span>
                     </Link>

                     <BsSearch
                        onClick={() => setOpenSearch(true)}
                        className='text-primary dark:text-white w-5 h-5 trans'
                     />
                  </div>
               )}
            </div>
         </div>

         <MobileNav
            navMobile={navMobile}
            setNavMobile={setNavMobile}
            currentUser={currentUser}
         />
      </div>
   );
};

export default Navbar;
