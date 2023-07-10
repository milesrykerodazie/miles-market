'use client';
import React, {FC} from 'react';

interface InputProps {
   label: string;
}

const AdminInput: FC<InputProps> = ({label}) => {
   return (
      <div className='w-full relative'>
         <p className='peer w-full px-4 py-2 pt-6 font-light bg-primarywhite border-2 rounded-md outline-none transition-all duration-300 ease-out disabled:opacity-70 disabled:cursor-not-allowed border-primary'>
            {label}
         </p>
      </div>
   );
};

export default AdminInput;
