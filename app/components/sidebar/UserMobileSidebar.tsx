'use client';

import {useState} from 'react';
import {RiCloseFill} from 'react-icons/ri';
import {TiThMenu} from 'react-icons/ti';
import UserMobile from './UserMobile';

const UserMobileSideBar = ({password}: {password: any}) => {
   const [navMobile, setNavMobile] = useState(false);
   return (
      <>
         <div
            className='cursor-pointer lg:hidden trans '
            onClick={() => setNavMobile(!navMobile)}
         >
            {navMobile ? (
               <span>
                  <RiCloseFill className='dark:text-primary text-white trans select-none  w-5 h-5' />
               </span>
            ) : (
               <span>
                  <TiThMenu className='dark:text-primary text-white trans  select-none w-5 h-5' />
               </span>
            )}
         </div>

         <UserMobile
            password={password}
            navMobile={navMobile}
            setNavMobile={setNavMobile}
         />
      </>
   );
};

export default UserMobileSideBar;
