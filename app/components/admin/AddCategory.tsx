'use client';
import axios from 'axios';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {FaSpinner} from 'react-icons/fa';
import {toast} from 'react-hot-toast';

interface ResponseProps {
   success: boolean;
   message: string;
}

const AddCategory = () => {
   //next route
   const router = useRouter();
   const [catName, setCatName] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const catData = {
      categoryName: catName.toLowerCase(),
   };

   //handle add category
   const addCategory = async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         if (!catName) {
            toast.error('Check all fields.');
            return;
         }
         const response = await axios.post('/api/category/new', catData);
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
               setCatName('');
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
      } catch (error: any) {
         console.log('add cat => ', error);
         toast.error('Something went wrong.');
      } finally {
         setIsLoading(false);
         router.refresh();
      }
   };

   return (
      <div className='pt-5'>
         <h1 className='mb-3 text-lg md:text-3xl font-semibold text-primary'>
            Add New Category
         </h1>
         <div className='flex items-center gap-3'>
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
               onClick={addCategory}
               disabled={!catName}
               className={`px-4 py-1 text-center text-white bg-primary dark:bg-white dark:text-primary font-semibold text-sm md:text-base border border-transparent rounded-md trans ${
                  !catName && 'cursor-not-allowed opacity-80'
               }`}
            >
               {isLoading ? <FaSpinner className='animate-spin' /> : 'Add'}
            </button>
         </div>
      </div>
   );
};

export default AddCategory;
