'use client';

import {useRouter} from 'next/navigation';
import React, {FC, useState} from 'react';
import {BiSearch} from 'react-icons/bi';
import {MdClear} from 'react-icons/md';

interface SearchVariationType {
   difference?: string;
}

const MiniSearch: FC<SearchVariationType> = ({difference}) => {
   const [searchQuery, setSearchQuery] = useState('');
   const router = useRouter();

   const submitHandler = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      if (typeof searchQuery !== 'string') {
         return;
      }

      // Create a new URLSearchParams object using the current URL search parameters
      const searchParams = new URLSearchParams(window.location.search);

      // Update or delete the 'model' search parameter based on the 'model' value
      if (searchQuery) {
         searchParams.set('keyword', searchQuery);
      } else {
         searchParams.delete('keyword');
      }

      const exactPath = window.location.pathname;

      // Generate the new pathname with the updated search parameters
      const newPathname = `${exactPath}?${searchParams.toString()}`;

      // const encodedSearchQuery = encodeURI(searchQuery);
      router.push(newPathname);
   };

   const clearSearch = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.preventDefault();
      if (typeof searchQuery !== 'string') {
         return;
      }

      const searchParams = new URLSearchParams(window.location.search);

      // Update or delete the 'model' search parameter based on the 'model' value
      if (searchQuery) {
         searchParams.delete('keyword');
      }

      const exactPath = window.location.pathname;

      // const encodedSearchQuery = encodeURI(searchQuery);
      setSearchQuery('');
      router.push(exactPath);
   };
   return (
      <div className='flex flex-nowrap items-center justify-center lg:justify-end lg:pb-2 pb-5 border-b md:border-none '>
         <div className='relative flex flex-row space-x-2 w-full'>
            <input
               className=' bg-white rounded-sm mr-2 py-1 pl-1 pr-7 border-b focus:border-primary/80 focus:outline-none  text-primary trans text-sm w-full'
               type='text'
               placeholder={
                  difference === 'order-search'
                     ? 'Enter Last Six characters'
                     : difference === 'product'
                     ? 'Enter product name'
                     : 'Enter User Name'
               }
               value={searchQuery || ''}
               onChange={(e) => setSearchQuery(e.target.value)}
               required
            />
            {searchQuery !== '' && (
               <MdClear
                  className='absolute top-2 right-4 cursor-pointer text-primary'
                  onClick={clearSearch}
               />
            )}
         </div>

         <button onClick={submitHandler} className=' text-primary '>
            <BiSearch className='w-5 h-5 lg:w-6 lg:h-6 trans' />
         </button>
      </div>
   );
};

export default MiniSearch;
