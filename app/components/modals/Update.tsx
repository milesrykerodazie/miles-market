'use client';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {FC, useState} from 'react';
import {toast} from 'react-hot-toast';
import {FaSpinner} from 'react-icons/fa';

interface DeleteProps {
   setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
   openEdit: boolean;
   catId: string;
}

const Update: FC<DeleteProps> = ({setOpenEdit, openEdit, catId}) => {
   //next route
   const route = useRouter();
   const [updating, setUpdating] = useState(false);
   const [name, setName] = useState('');

   const updateCategory = async () => {
      setUpdating(true);
      if (!name) {
         return;
      }

      try {
         const response = await axios.patch(`/api/category/${catId}/edit`, {
            name: name,
         });
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
         setUpdating(false);
         setOpenEdit(false);
         route.refresh();
      } catch (error: any) {
         console.log('error => ', error?.response?.data);
         setUpdating(false);
      } finally {
         setUpdating(false);
      }
   };

   return (
      <div className='absolute z-50 bg-primary/50 top-0 w-full h-full rounded-md trans flex flex-col space-y-3 justify-center items-center px-3'>
         <h4 className='text-white font-semibold text-lg'>Are you sure?</h4>
         <input
            type='text'
            className='appearance-none border border-white bg-white rounded-md py-1 px-3 outline-none text-sm text-primary w-full'
            placeholder='Category name'
            name='category name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
         />
         {updating ? (
            <div className='gap-2 flex items-center text-white trans'>
               <span className='text-sm animate-pulse'>Updating...</span>
               <FaSpinner className='animate-spin' />
            </div>
         ) : (
            <div className='flex gap-5 trans'>
               <button
                  onClick={updateCategory}
                  className='px-4 py-1 text-center text-red-600 bg-white font-semibold border border-transparent rounded-md trans text-sm md:text-base '
               >
                  Update
               </button>
               <button
                  onClick={() => setOpenEdit(false)}
                  className='px-4 py-1 text-center text-primary bg-white  font-semibold border border-transparent rounded-md trans text-sm md:text-base'
               >
                  Cancel
               </button>
            </div>
         )}
      </div>
   );
};

export default Update;
