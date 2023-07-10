'use client';
import {SafeUser} from '@/app/types';
import React, {FC, useState} from 'react';
import AdminInput from '../inputs/AdminInput';
import Image from 'next/image';
import {MdKeyboardArrowRight, MdOutlineKeyboardArrowDown} from 'react-icons/md';
import {FaSpinner} from 'react-icons/fa';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';

interface UserProps {
   userData: SafeUser;
   roles: {
      id: string;
      role: string;
   }[];
}

const EditUser: FC<UserProps> = ({userData, roles}) => {
   //next route
   const router = useRouter();

   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [userRole, setUserRole] = useState('');

   //handle update user role
   const updateUserRole = async (e: React.FormEvent<HTMLFormElement>) => {
      //add cat method here
      e.preventDefault();

      setIsLoading(true);

      if (userRole === '') {
         return;
      }

      try {
         const response = await axios.patch(`/api/user/${userData?.id}/edit`, {
            role: userRole,
         });
         setUserRole('');

         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
      } catch (error) {
         toast.success('Something went wrong.');
      } finally {
         setIsLoading(false);
         router.refresh();
      }
   };

   return (
      <form onSubmit={updateUserRole} className='space-y-5'>
         <div className='flex flex-col lg:flex-row gap-2 w-full'>
            {/* add product section */}
            <section className=' bg-white p-3 rounded-lg drop-shadow-md lg:w-[60%] w-full'>
               <h1 className='mb-3 text-lg md:text-3xl font-semibold text-primary'>
                  Edit User
               </h1>

               <>
                  <div className='mb-4'>
                     <label className='block mb-1 text-primary text-sm md:text-base'>
                        {' '}
                        Name{' '}
                     </label>
                     <p className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-primary text-sm md:text-base'>
                        {userData?.name}
                     </p>
                  </div>

                  <div className='mb-4 mt-5'>
                     <label className='block mb-1 text-primary text-sm md:text-base'>
                        Email
                     </label>
                     <p className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-primary text-sm md:text-base'>
                        {userData?.email}
                     </p>
                  </div>

                  <div className='grid md:grid-cols-2 gap-x-2 mt-5'>
                     <div className='mb-4'>
                        <label className='block mb-1 text-primary text-sm md:text-base'>
                           {' '}
                           Username{' '}
                        </label>
                        <div className='relative'>
                           <div className='col-span-2'>
                              <p className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-primary text-sm md:text-base'>
                                 {userData?.username
                                    ? userData?.username
                                    : 'no-username'}
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* custom select option */}

                     <div className='md:flex-1 relative'>
                        <label
                           htmlFor='category'
                           className='text-primary text-sm md:text-base'
                        >
                           Role
                        </label>
                        <div
                           className='flex py-1 relative cursor-pointer'
                           onClick={() => setOpen((current) => !current)}
                        >
                           <p className='border rounded-lg border-primary py-2 pl-3 pr-3 w-full text-primary capitalize tracking-wider text-sm md:text-base'>
                              {userRole ? userRole : userData?.role}
                           </p>
                           <div className='absolute right-0 top-3'>
                              {!open ? (
                                 <MdKeyboardArrowRight className='w-4 h-4 lg:w-6 lg:h-6 text-primary' />
                              ) : (
                                 <MdOutlineKeyboardArrowDown className='w-4 h-4 lg:w-6 lg:h-6 text-primary ' />
                              )}
                           </div>
                        </div>
                        {/* select category */}
                        {open && (
                           <div className='bg-white shadow-sm shadow-primary absolute top-20 z-20 rounded overflow-y-auto w-full trans space-y-1 text-sm md:text-base'>
                              {roles?.map((role) => (
                                 <p
                                    key={role.id}
                                    onClick={() => {
                                       setUserRole(role.role);
                                       setOpen((current) => !current);
                                    }}
                                    className='text-sm text-primary cursor-pointer hover:bg-primary hover:text-white trans select-none'
                                 >
                                    <span className='pl-2 '>{role.role}</span>
                                 </p>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>

                  <div className='grid md:grid-cols-2 gap-x-2 mt-5'>
                     <div className='mb-4'>
                        <label className='block mb-1 text-primary text-sm md:text-base'>
                           Registered Date
                        </label>
                        <p className='appearance-none border border-primary bg-white rounded-md py-2 px-3 focus:outline-none w-full text-primary text-xs lg:text-sm'>
                           {/* remember to format this data */}
                           {userData?.createdAt}
                        </p>
                     </div>

                     <div className='mb-4'>
                        <label className='block mb-1 text-primary text-sm md:text-base'>
                           {' '}
                           User ID
                        </label>
                        <div className='relative'>
                           <div className='col-span-2'>
                              <p className='appearance-none border border-primary bg-white rounded-md py-2 px-3 focus:outline-none w-full text-primary text-xs lg:text-sm'>
                                 {userData?.id}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            </section>

            {/* add product images section */}
            <section className='bg-white p-3 rounded-lg drop-shadow-md lg:w-[40%] w-full'>
               <>
                  <h2 className='mb-3 text-lg lg:text-2xl font-semibold text-primary'>
                     Users Profile Pic
                  </h2>

                  <div className='w-full rounded-sm space-y-1'>
                     <Image
                        src={
                           userData?.image
                              ? userData?.image
                              : 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-0.jpg'
                        }
                        alt='Preview'
                        className='w-full h-72 rounded-md object-contain'
                        width='200'
                        height='200'
                     />
                  </div>
               </>
            </section>
         </div>

         <button
            type='submit'
            disabled={userRole === ''}
            className={`my-2 px-4 py-2 text-center inline-block text-white bg-primary  font-semibold border border-transparent text-sm md:text-base rounded-md w-full trans ${
               userRole === '' && 'cursor-not-allowed opacity-80'
            }`}
         >
            {isLoading ? (
               <div className='gap-2 flex items-center justify-center'>
                  <span className='text-sm animate-pulse'>Update...</span>
                  <FaSpinner className='animate-spin' />
               </div>
            ) : (
               'Update User Role'
            )}
         </button>
      </form>
   );
};

export default EditUser;
