'use client';
import React, {FC, useState} from 'react';
import {useRouter} from 'next/navigation';
import {FaSpinner} from 'react-icons/fa';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import AllCategories from './AllCategories';
import MiniSearch from './MiniSearch';

interface CatProps {
   id: string;
   categoryName: string;
}

interface CategoriesTypes {
   categories: CatProps[];
}

const AddCategory: FC<CategoriesTypes> = ({categories}) => {
   //next route
   const router = useRouter();
   const [catName, setCatName] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const catData = {
      categoryName: catName.toLowerCase(),
   };

   //handle add category
   const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         if (!catName) {
            toast.error('Check all fields.');
            return;
         }
         const catesRponse = await axios.post('/api/category/new', catData);

         if (catesRponse?.data) {
            if (catesRponse?.data?.success === true) {
               toast.success(catesRponse?.data?.message);
               setCatName('');
            }
            if (catesRponse?.data?.success === false) {
               toast.error(catesRponse?.data?.message);
            }
         }
      } catch (error: any) {
         toast.error('Something went wrong.');
      } finally {
         setIsLoading(false);
         router.refresh();
      }
   };

   return (
      <div className='flex flex-col lg:flex-row justify-between space-y-5 lg:space-y-0 lg:space-x-5'>
         {/* all categories */}
         <section className='lg:flex-grow '>
            <MiniSearch difference='category' />
            <AllCategories categories={categories} />
         </section>
         <section className='flex flex-col border-l lg:pl-3'>
            <h1 className='mb-3 font-semibold text-primary text-sm md:text-base'>
               Add New Category
            </h1>
            <form
               onSubmit={handleAddCategory}
               className='flex items-center gap-3'
            >
               <div className=''>
                  <input
                     type='text'
                     className='appearance-none border border-primary/70 bg-white rounded-md py-1 px-3 outline-none text-sm text-primary'
                     placeholder='Category name'
                     name='category name'
                     value={catName}
                     onChange={(e) => setCatName(e.target.value)}
                     required
                  />
               </div>
               <button
                  type='submit'
                  disabled={!catName}
                  className={`px-2 py-1 text-center text-white bg-primary dark:bg-white dark:text-primary font-semibold text-sm border border-transparent rounded-md trans ${
                     !catName && 'cursor-not-allowed opacity-80'
                  }`}
               >
                  {isLoading ? <FaSpinner className='animate-spin' /> : 'Add'}
               </button>
            </form>
         </section>
      </div>
   );
};

export default AddCategory;
