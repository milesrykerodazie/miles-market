'use client';

import React, {FC, useCallback, useState} from 'react';
import {SafeUser} from '../../types';
import {signOut} from 'next-auth/react';
import MenuItem from './MenuItem';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import {AiOutlineMenu} from 'react-icons/ai';
import Avatar from '../Avatar';

interface UseMenuProps {
   currentUser?: SafeUser | null;
}

const UseMenu: FC<UseMenuProps> = ({currentUser}) => {
   //using the modal hooks
   const loginModal = useLoginModal();
   const registerModal = useRegisterModal();

   //state to open modal
   const [isOpen, setIsOpen] = useState(false);

   //toggle modal open and close
   const toggleOpen = useCallback(() => {
      setIsOpen((value) => !value);
   }, []);

   return (
      <div className=' relative'>
         <div className='flex flex-row items-center gap-3'>
            <div
               onClick={toggleOpen}
               className='p-2 md:py-1 md:px-2 shadow-md shadow-primary dark:bg-primarywhite flex flex-row items-center gap-3 rounded-full cursor-pointer transition-all duration-500 ease-out hover:bg-primary hover:text-primarywhite text-primary dark:hover:text-primary dark:hover:shadow-md dark:hover:shadow-primarywhite'
            >
               <AiOutlineMenu className='w-5 h-5' />
               <div className='hidden md:block'>
                  <Avatar src={currentUser?.image} />
               </div>
            </div>
         </div>
         {isOpen && (
            <div className='absolute rounded-xl shadow-md w-32 md:w-60 bg-white dark:bg-primarywhite dark:hover:text-primary dark:hover:shadow-md dark:hover:shadow-primarywhite transition-all duration-300 ease-out drop-shadow-lg overflow-hidden right-0 top-16 md:top-12 text-sm'>
               <div className='cursor-pointer flex flex-col'>
                  {currentUser ? (
                     <MenuItem
                        label='logout'
                        onClick={() => {
                           signOut();
                        }}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                     />
                  ) : (
                     <>
                        <MenuItem
                           label='Login'
                           onClick={loginModal.onOpen}
                           isOpen={isOpen}
                           setIsOpen={setIsOpen}
                        />
                        <MenuItem
                           label='Register'
                           onClick={registerModal.onOpen}
                           isOpen={isOpen}
                           setIsOpen={setIsOpen}
                        />
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default UseMenu;
