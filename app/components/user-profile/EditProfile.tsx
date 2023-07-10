'use client';

import React, {FC, useState} from 'react';
import Input from '../inputs/Input';
import Image from 'next/image';
import {SafeUser} from '@/app/types';
import {AiFillCloseCircle} from 'react-icons/ai';
import {FaSpinner} from 'react-icons/fa';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast';

interface UserDetailsProps {
   userData: SafeUser;
}

const EditProfile: FC<UserDetailsProps> = ({userData}) => {
   //next route
   const router = useRouter();
   const [name, setName] = useState(userData?.name);
   const [username, setUsername] = useState(userData?.username);
   const [image, setImage] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   //image on change
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
         const reader = new FileReader();

         reader.onloadend = () => {
            const base64String = reader.result as string;
            setImage(base64String);
         };

         reader.readAsDataURL(file);
      }
   };

   //update data
   const userUpdateData = {
      id: userData?.id,
      name: name,
      username: username,
      image: image,
   };

   //update my profile
   const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (name === '') {
         return;
      }

      try {
         const response = await axios.patch(
            `/api/my-profile/edit`,
            userUpdateData,
         );
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
         setIsLoading(false);
      } catch (error: any) {
         console.log('error => ', error?.response?.data);
      } finally {
         setImage('');
         router.refresh();
      }
   };
   return (
      <form onSubmit={updateProfile}>
         <div className='flex flex-col lg:flex-row gap-2 w-full'>
            {/* add product section */}
            <section className=' bg-white p-3 lg:w-[60%] w-full'>
               <h1 className='mb-3 text-lg md:text-3xl font-semibold text-primary'>
                  Edit My Profile
               </h1>

               <div className='flex flex-col gap-4'>
                  <Input
                     id='name'
                     label='Name'
                     value={name}
                     type='text'
                     onChange={(event) => setName(event.target.value)}
                     required
                     disabled={isLoading}
                  />
                  <div className='mb-4 mt-5'>
                     <label className='block mb-1 text-primary'>Email</label>
                     <p className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-primary text-sm md:text-base'>
                        {userData?.email}
                     </p>
                  </div>
                  <Input
                     id='username'
                     label='Username'
                     value={username}
                     type='text'
                     placeholder='choose-username'
                     onChange={(event) => setUsername(event.target.value)}
                     required
                     disabled={isLoading}
                  />
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
               </div>
            </section>
            {/* add product images section */}
            <section className='bg-white p-3 lg:w-[40%] w-full'>
               <>
                  <h2 className='mb-3 text-lg lg:text-2xl font-semibold text-primary'>
                     Profile Pic
                  </h2>

                  {image ? (
                     <div className='w-full rounded-sm space-y-1 relative'>
                        <Image
                           src={image}
                           alt='Preview'
                           className='w-full h-72 rounded-md object-contain'
                           width='200'
                           height='200'
                        />
                        <AiFillCloseCircle
                           className='absolute -top-2 text-red-600 w-7 h-7 -right-1 cursor-pointer'
                           onClick={() => setImage('')}
                        />
                     </div>
                  ) : (
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
                        />
                     </div>
                  )}

                  <input
                     className='form-control block w-full px-2 py-1.5 font-normal text-primary bg-white bg-clip-padding rounded transition ease-in-out m-0  focus:bg-white focus:outline-none mt-8 text-sm md:text-base shadow-sm shadow-primary'
                     type='file'
                     accept='image/*'
                     onChange={handleFileChange}
                  />
               </>
            </section>
         </div>
         <button
            type='submit'
            className='my-2 px-4 py-2 text-center inline-block text-white bg-primary/90  font-semibold hover:bg-primary rounded-md w-full trans text-sm md:text-base'
         >
            {isLoading ? (
               <div className='gap-2 flex items-center justify-center'>
                  <span className='text-sm animate-pulse'>Update...</span>
                  <FaSpinner className='animate-spin' />
               </div>
            ) : (
               'Update Profile'
            )}
         </button>
      </form>
   );
};

export default EditProfile;
