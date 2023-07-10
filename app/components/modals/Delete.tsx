'use client';
import React, {FC} from 'react';
import {FaSpinner} from 'react-icons/fa';

interface DeleteProps {
   deleteEntry: () => void;
   setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
   openModal: boolean;
   deleting: boolean;
}

const Delete: FC<DeleteProps> = ({
   deleteEntry,
   setOpenModal,
   openModal,
   deleting,
}) => {
   return (
      <div className='absolute z-50 bg-primary/50 top-0 w-full h-full rounded-md trans flex flex-col space-y-3 justify-center items-center'>
         <h4 className='text-white font-semibold text-lg'>Are you sure?</h4>
         {deleting ? (
            <div className='gap-2 flex items-center text-white trans'>
               <span className='text-sm animate-pulse'>Deleting...</span>
               <FaSpinner className='animate-spin' />
            </div>
         ) : (
            <div className='flex gap-5 trans'>
               <button
                  onClick={deleteEntry}
                  className='px-4 py-1 text-center text-red-600 bg-white font-semibold border border-transparent rounded-md trans text-sm md:text-base '
               >
                  Yes
               </button>
               <button
                  onClick={() => setOpenModal(false)}
                  className='px-4 py-1 text-center text-primary bg-white  font-semibold border border-transparent rounded-md trans text-sm md:text-base'
               >
                  No
               </button>
            </div>
         )}
      </div>
   );
};

export default Delete;
