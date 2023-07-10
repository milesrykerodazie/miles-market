'use client';
import React, {FC, useState} from 'react';
import SideBar from '../SideBar';
import {FaSpinner} from 'react-icons/fa';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai';
import Link from 'next/link';
import {countries} from 'countries-list';
import {MdKeyboardArrowRight, MdOutlineKeyboardArrowDown} from 'react-icons/md';
import {Address} from '@prisma/client';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';

interface AddressProps {
   address: Address;
}

const EditAddress: FC<AddressProps> = ({address}) => {
   //the route
   const route = useRouter();
   // the states
   const [street, setStreet] = useState(address?.street);
   const [city, setCity] = useState(address?.city);
   const [state, setState] = useState(address?.state);
   const [phoneNo, setPhoneNo] = useState(address?.phoneNo);
   const [country, setCountry] = useState(address?.country);
   const [isLoading, setIsLoading] = useState(false);

   const [open, setOpen] = useState(false);

   const countriesList = Object.values(countries);

   const canSubmit = country !== '' && state !== '' && phoneNo !== '';

   const updateData = {
      country,
      state,
      city,
      street,
      phoneNo,
   };

   const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (!canSubmit) {
         return;
      }

      try {
         const response = await axios.patch(
            `/api/address/${address?.id}/edit`,
            updateData,
         );
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
      } catch (error) {
         console.log('address update error => ', error);
      } finally {
         setIsLoading(false);
         route.refresh();
      }
   };
   return (
      <>
         <section className='py-10'>
            <div className='w-full lg:max-w-screen-xl mx-auto lg:px-4 text-primary'>
               <main className=' lg:px-4'>
                  <form onSubmit={submitHandler}>
                     <h2 className='mb-5 text-lg lg:text-2xl font-semibold'>
                        Update Address
                     </h2>

                     <div className='mb-4 md:col-span-2'>
                        <label className='block mb-1 text-sm md:text-base text-primary'>
                           {' '}
                           Street*{' '}
                        </label>
                        <input
                           className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base text-primary'
                           type='text'
                           placeholder='Type your address'
                           value={street}
                           onChange={(e) => setStreet(e.target.value)}
                        />
                     </div>

                     <div className='grid md:grid-cols-2 gap-x-3'>
                        <div className='mb-4 md:col-span-1 relative'>
                           <label className='block mb-1 text-sm md:text-base'>
                              {' '}
                              Country{' '}
                           </label>

                           <div
                              className='flex relative cursor-pointer'
                              onClick={() => setOpen((current) => !current)}
                           >
                              <p className='border rounded-lg border-primary/70 py-2 pl-3 pr-3 w-full text-primary capitalize tracking-wider text-sm md:text-base'>
                                 {country === '' ? 'Select Category' : country}
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
                              <div className='bg-white shadow-sm shadow-primary absolute top-20 z-20 rounded h-36 overflow-y-auto w-full duration-500 ease-in space-y-1'>
                                 {countriesList?.length > 0 &&
                                    countriesList.map((country) => (
                                       <p
                                          key={country?.name}
                                          onClick={() => {
                                             setCountry(country?.name);
                                             setOpen((current) => !current);
                                          }}
                                          className='text-sm text-primary cursor-pointer hover:bg-primary hover:text-white trans select-none'
                                       >
                                          <span className='pl-2 '>
                                             {country?.name
                                                ? country?.name
                                                : 'Select Category'}
                                          </span>
                                       </p>
                                    ))}
                              </div>
                           )}
                        </div>

                        <div className='mb-4 md:col-span-1'>
                           <label className='block mb-1 text-sm md:text-base text-primary'>
                              {' '}
                              State{' '}
                           </label>
                           <input
                              className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base text-primary'
                              type='text'
                              placeholder='Type state here'
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                           />
                        </div>
                     </div>

                     <div className='grid md:grid-cols-2 gap-x-2'>
                        <div className='mb-4 md:col-span-1'>
                           <label className='block mb-1 text-sm md:text-base text-primary'>
                              {' '}
                              City{' '}
                           </label>
                           <input
                              className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base text-primary'
                              type='text'
                              placeholder='Type your city'
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                           />
                        </div>
                        <div className='mb-4 md:col-span-1'>
                           <label className='block mb-1 text-sm md:text-base text-primary'>
                              {' '}
                              Phone No{' '}
                           </label>
                           <input
                              className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base text-primary'
                              type='number'
                              placeholder='Type phone no here'
                              value={phoneNo}
                              onChange={(e) => setPhoneNo(e.target.value)}
                           />
                        </div>
                     </div>

                     <button
                        type='submit'
                        className='my-2 px-4 py-2 text-center inline-block text-white bg-primary/90 hover:bg-primary  font-semibold border border-transparent rounded-md w-full trans text-sm md:text-base'
                     >
                        {isLoading ? (
                           <div className='gap-2 flex items-center justify-center'>
                              <span className='text-sm animate-pulse'>
                                 Updating Address...
                              </span>
                              <FaSpinner className='animate-spin' />
                           </div>
                        ) : (
                           'Update'
                        )}
                     </button>
                  </form>
               </main>
            </div>
         </section>
      </>
   );
};

export default EditAddress;
