'use client';

import {SafeUser} from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';
import React, {FC, useState} from 'react';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai';
import Delete from '../modals/Delete';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {signOut} from 'next-auth/react';

interface UserDetailsProps {
   userData: SafeUser;
}

const UserProfile: FC<UserDetailsProps> = ({userData}) => {
   //next route
   const router = useRouter();

   const [openModal, setOpenModal] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [userId, setUserId] = useState('');

   const deleteUser = async () => {
      setDeleting(true);

      if (userId === '') {
         return;
      }

      try {
         const deleteRes = await axios.delete(`/api/user/${userId}/delete`);
         if (deleteRes.data) {
            if (deleteRes?.data?.success === true) {
               toast.success(deleteRes?.data?.message);
               signOut();
               setDeleting(false);
               setOpenModal(false);
            }
            if (deleteRes?.data?.success === false) {
               toast.error(deleteRes?.data?.message);
               setDeleting(false);
               setOpenModal(false);
            }
         }
      } catch (error) {
         console.log(error);
      } finally {
         router.refresh();
      }
   };
   return (
      <div className=''>
         <div className='flex justify-end pb-3'>
            <Link
               href={
                  userData?.role === 'ADMIN'
                     ? '/admin-dashboard/update-profile'
                     : '/user-dashboard/update-profile'
               }
               className='px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-4'
            >
               <AiFillEdit />
            </Link>
            <span
               onClick={() => {
                  setOpenModal(true);
                  setUserId(userData?.id);
               }}
               className='px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer'
            >
               <AiFillDelete />
            </span>
         </div>

         <div className='relative flex flex-col lg:flex-row gap-2 w-full'>
            {/* add product section */}
            <section className=' bg-white p-3 lg:w-[60%] w-full'>
               <h1 className='mb-3 text-lg md:text-3xl font-semibold text-primary'>
                  My Profile
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
                        <div className='flex py-1 relative cursor-pointer'>
                           <p className='border rounded-lg border-primary py-2 pl-3 pr-3 w-full text-primary capitalize tracking-wider text-sm md:text-base'>
                              {userData?.role}
                           </p>
                        </div>
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
            <section className='bg-white p-3 lg:w-[40%] w-full'>
               <>
                  <h2 className='mb-3 text-lg lg:text-2xl font-semibold text-primary'>
                     Profile Pic
                  </h2>

                  <div className='w-full rounded-sm space-y-1'>
                     <Image
                        src={
                           userData?.image
                              ? userData?.image
                              : '/images/no-user.jpg'
                        }
                        alt='Preview'
                        className='w-full h-72 rounded-md object-cover'
                        width='200'
                        height='200'
                        priority
                        referrerPolicy='no-referrer'
                     />
                  </div>
               </>
            </section>

            {openModal && (
               <Delete
                  deleteEntry={deleteUser}
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                  deleting={deleting}
               />
            )}
         </div>
      </div>
   );
};

export default UserProfile;
