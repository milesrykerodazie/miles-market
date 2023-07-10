'use client';

import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {toast} from 'react-hot-toast';
import {FaSpinner} from 'react-icons/fa';

const PasswordUpdate = () => {
   //next route
   const router = useRouter();
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmNewPassword, setConfirmNewPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const canSubmit = currentPassword !== '' && newPassword !== '';

   const disable =
      newPassword !== confirmNewPassword || currentPassword === '' || isLoading;

   const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (!canSubmit) {
         return;
      }

      try {
         const response = await axios.post('/api/user/update-password', {
            currentPassword,
            newPassword,
         });

         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
               setCurrentPassword('');
               setNewPassword('');
               setConfirmNewPassword('');
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
      } catch (error) {
         console.log('the password update error => ', error);
      } finally {
         setIsLoading(false);
         router.refresh();
      }
   };
   return (
      <>
         <div
            // style={{maxWidth: '500px'}}
            className='mt-5 mb-20 lg:p-4 mx-auto rounded bg-white lg:max-width-3xl w-full'
         >
            <form onSubmit={submitHandler}>
               <h2 className='mb-5 text-lg lg:text-2xl font-semibold text-primary'>
                  Update Password
               </h2>

               <div className='mb-4'>
                  <label className='block mb-1 text-primary text-sm md:text-base'>
                     {' '}
                     Current Password{' '}
                  </label>
                  <input
                     className=' border bg-white rounded-md py-2 px-3  focus:outline-none focus:border-primary w-full trans text-sm md:text-base text-primary'
                     type='password'
                     placeholder='Type your password'
                     minLength={6}
                     required
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                  />
               </div>

               <div className='mb-4'>
                  <label className='block mb-1 text-primary text-sm md:text-base'>
                     {' '}
                     New Password{' '}
                  </label>
                  <input
                     className=' border bg-white rounded-md py-2 px-3  focus:outline-none focus:border-primary w-full trans text-sm md:text-base text-primary'
                     type='password'
                     placeholder='New password'
                     minLength={6}
                     required
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                  />
               </div>
               <div className='mb-4'>
                  <label className='block mb-1 text-primary text-sm md:text-base'>
                     {' '}
                     Confirm New Password{' '}
                  </label>
                  <input
                     className={`border bg-white rounded-md py-2 px-3  focus:outline-none w-full trans text-sm md:text-base text-primary ${
                        newPassword === confirmNewPassword
                           ? 'focus:border-primary'
                           : 'focus:border-red-600 shadow-sm shadow-red-600'
                     }`}
                     type='password'
                     placeholder='Confirm New password'
                     minLength={6}
                     required
                     value={confirmNewPassword}
                     onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
               </div>
               {}

               <button
                  type='submit'
                  disabled={disable}
                  className='my-2 px-4 py-2 text-center w-full inline-block text-white bg-primary/90 border border-transparent rounded-md hover:bg-primary trans text-sm md:text-base '
               >
                  {isLoading ? (
                     <div className='gap-2 flex items-center justify-center trans'>
                        <span className='text-sm animate-pulse'>
                           Updating...
                        </span>
                        <FaSpinner className='animate-spin' />
                     </div>
                  ) : (
                     'Update Password'
                  )}
               </button>
            </form>
         </div>
      </>
   );
};

export default PasswordUpdate;
