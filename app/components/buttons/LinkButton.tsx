'use client';
import Link from 'next/link';
import React from 'react';

const LinkButton = () => {
   return (
      <Link
         href='/admin-dashboard/category/new'
         className='px-4 py-1 text-center text-white bg-primary dark:bg-white dark:text-primary font-semibold text-sm md:text-base border border-transparent rounded-md trans my-3'
      >
         Add Category
      </Link>
   );
};

export default LinkButton;
