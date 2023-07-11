'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {FaSpinner} from 'react-icons/fa';
import {toast} from 'react-hot-toast';
import axios from 'axios';

const AddCategory = () => {
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
      <div className='py-20 flex flex-col justify-center items-center'>
         <h1 className='mb-3 text-lg md:text-2xl font-semibold text-primary'>
            Add New Category
         </h1>
         <form onSubmit={handleAddCategory} className='flex items-center gap-3'>
            <div className=''>
               <input
                  type='text'
                  className='appearance-none border border-primary bg-white rounded-md py-1 px-3 outline-none w-full text-sm md:text-base text-primary'
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
               className={`px-4 py-1 text-center text-white bg-primary dark:bg-white dark:text-primary font-semibold text-sm md:text-base border border-transparent rounded-md trans ${
                  !catName && 'cursor-not-allowed opacity-80'
               }`}
            >
               {isLoading ? <FaSpinner className='animate-spin' /> : 'Add'}
            </button>
         </form>
      </div>
   );
};

export default AddCategory;
