'use client';

import {useState} from 'react';
import {RiCloseFill} from 'react-icons/ri';
import {TiThMenu} from 'react-icons/ti';
import Mobile from './Mobile';

const MobileSideBar = ({password}: {password: any}) => {
   const [navMobile, setNavMobile] = useState(false);
   return (
      <>
         <div
            className='cursor-pointer lg:hidden trans '
            onClick={() => setNavMobile(!navMobile)}
         >
            {navMobile ? (
               <span>
                  <RiCloseFill className='dark:text-primary w-5 h-5 text-white trans select-none ' />
               </span>
            ) : (
               <span>
                  <TiThMenu className='dark:text-primary text-white w-5 h-5 trans  select-none' />
               </span>
            )}
         </div>

         <Mobile
            password={password}
            navMobile={navMobile}
            setNavMobile={setNavMobile}
         />
      </>
   );
};

export default MobileSideBar;
