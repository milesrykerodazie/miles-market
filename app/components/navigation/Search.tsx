'use client';

import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

const Search = () => {
   const [searchQuery, setSearchQuery] = useState('');
   const router = useRouter();

   const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
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

      const exactPath = window.location.pathname === '/' ? '/' : '/';

      // Generate the new pathname with the updated search parameters
      const newPathname = `${exactPath}?${searchParams.toString()}`;

      // const encodedSearchQuery = encodeURI(searchQuery);
      router.push(newPathname);

      setSearchQuery('');
   };
   return (
      <form
         onSubmit={submitHandler}
         className='flex flex-nowrap items-center w-full lg:w-2/4'
      >
         <input
            className='flex-grow focus:border bg-white rounded-md mr-2 py-2 px-3 hover:border-primary focus:outline-none focus:border-primary shadow-md shadow-primary text-primary trans text-sm lg:text-base'
            type='text'
            placeholder='Enter your keyword'
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
         />
         <button
            type='submit'
            className='px-4 py-2 inline-block border border-transparent bg-primary text-white rounded-md hover:bg-primary/80 dark:bg-white dark:text-primary trans dark:hover:font-semibold text-sm lg:text-base'
         >
            Search
         </button>
      </form>
   );
};

export default Search;
