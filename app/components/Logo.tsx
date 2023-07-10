'use client';

import Image from 'next/image';
import Link from 'next/link';
import {SiMarketo} from 'react-icons/si';

const Logo = () => {
   return (
      <Link href='/'>
         <SiMarketo
            className='rounded-full w-6 h-6 lg:w-8 lg:h-8 object-cover cursor-pointer text-primary dark:text-white
      '
         />
      </Link>
   );
};

export default Logo;
