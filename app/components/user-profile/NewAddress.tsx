'use client';
import React, {useState} from 'react';
import {FaSpinner} from 'react-icons/fa';
import {countries} from 'countries-list';
import {MdKeyboardArrowRight, MdOutlineKeyboardArrowDown} from 'react-icons/md';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';

const NewAddress = () => {
   //the route
   const route = useRouter();
   // the states
   const [street, setStreet] = useState('');
   const [city, setCity] = useState('');
   const [state, setState] = useState('');
   const [phoneNo, setPhoneNo] = useState('');
   const [country, setCountry] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [open, setOpen] = useState(false);

   const countriesList = Object.values(countries);

   const canSubmit = country !== '' && state !== '' && phoneNo !== '';

   const addressData = {
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
         const response = await axios.post('/api/address/new', addressData);
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
               setStreet('');
               setCountry('');
               setState('');
               setCity('');
               setPhoneNo('');
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
      } catch (error) {
         console.log('address error => ', error);
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
                        Add new Address
                     </h2>

                     <div className='mb-4 md:col-span-2'>
                        <label className='block mb-1 text-sm md:text-base'>
                           {' '}
                           Street*{' '}
                        </label>
                        <input
                           className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base'
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
                              <div className='bg-white shadow-sm shadow-primary absolute top-20 z-20 rounded h-36 overflow-y-auto w-full duration-500 ease-in space-y-1 text-sm md:text-base'>
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
                           <label className='block mb-1 text-sm md:text-base'>
                              {' '}
                              State{' '}
                           </label>
                           <input
                              className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base'
                              type='text'
                              placeholder='Type state here'
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                           />
                        </div>
                     </div>

                     <div className='grid md:grid-cols-2 gap-x-2'>
                        <div className='mb-4 md:col-span-1'>
                           <label className='block mb-1 text-sm md:text-base'>
                              {' '}
                              City{' '}
                           </label>
                           <input
                              className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base'
                              type='text'
                              placeholder='Type your city'
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                           />
                        </div>
                        <div className='mb-4 md:col-span-1'>
                           <label className='block mb-1 text-sm md:text-base'>
                              {' '}
                              Phone No{' '}
                           </label>
                           <input
                              className='border border-primary/70 bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/70 trans w-full text-sm md:text-base'
                              type='text'
                              placeholder='Type phone no here'
                              value={phoneNo}
                              onChange={(e) => setPhoneNo(e.target.value)}
                           />
                        </div>
                     </div>

                     <button
                        type='submit'
                        disabled={!canSubmit}
                        className='my-2 px-4 py-2 text-center inline-block text-white bg-primary/90 hover:bg-primary  font-semibold border border-transparent rounded-md text-sm md:text-base w-full trans disabled:cursor-not-allowed disabled:opacity-50'
                     >
                        {isLoading ? (
                           <div className='gap-2 flex items-center justify-center'>
                              <span className='text-sm animate-pulse'>
                                 Adding Address...
                              </span>
                              <FaSpinner className='animate-spin' />
                           </div>
                        ) : (
                           'Add'
                        )}
                     </button>
                  </form>
               </main>
            </div>
         </section>
      </>
   );
};

export default NewAddress;
