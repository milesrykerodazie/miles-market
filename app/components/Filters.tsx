'use client';

import React, {useState} from 'react';
import StarRatings from 'react-star-ratings';
import {useRouter} from 'next/navigation';
import {getPriceQueryParams} from '../helpers/helper';

interface CategoryProps {
   categories?: {
      id: string;
      categoryName: string;
   }[];
}

const Filters = ({categories}: CategoryProps) => {
   const [min, setMin] = useState('');
   const [max, setMax] = useState('');
   const [openFilter, setOpenFilter] = useState(false);

   const router = useRouter();

   let queryParams: any;

   const handleButtonClick = () => {
      if (typeof window !== 'undefined') {
         queryParams = new URLSearchParams(window.location.search);

         queryParams = getPriceQueryParams(queryParams, 'min', min);
         queryParams = getPriceQueryParams(queryParams, 'max', max);

         const path = `${window.location.pathname}?${queryParams.toString()}`;
         router.push(path);
         setMin('');
         setMax('');
      }
   };

   //the checkboxes click
   const handleClick = (checkbox: any) => {
      if (typeof window !== 'undefined') {
         queryParams = new URLSearchParams(window.location.search);
      }

      const checkboxes = document.getElementsByName(checkbox.name);

      checkboxes.forEach((item: any) => {
         if (item !== checkbox) item.checked = false;
      });

      if (checkbox.checked === false) {
         // Delete the filter from query
         queryParams.delete(checkbox.name);
      } else {
         // Set filter in the query
         if (queryParams.has(checkbox.name)) {
            queryParams.set(checkbox.name, checkbox.value);
         } else {
            queryParams.append(checkbox.name, checkbox.value);
         }
      }
      const path2 = window.location.pathname + '?' + queryParams.toString();
      const path = `${window.location.pathname}?${queryParams.toString()}`;
      router.push(path);
   };

   const checkHandler = (
      checkBoxType: string,
      checkBoxValue: string | number,
   ) => {
      if (typeof window !== 'undefined') {
         queryParams = new URLSearchParams(window.location.search);

         const value = queryParams.get(checkBoxType);
         if (checkBoxValue === value) return true;
         return false;
      }
   };

   const rateArray = [5, 4, 3, 2, 1];

   return (
      <aside className='w-full lg:w-1/4 lg:px-4'>
         {/* mobile starts here */}
         <div className='relative'>
            <div
               className='lg:hidden mb-5 w-full text-center px-2 py-1 inline-block text-lg dark:text-primary dark:bg-white bg-primary text-white shadow-sm border border-primary rounded-md trans'
               onClick={() => setOpenFilter((current) => !current)}
            >
               <span className='text-sm'>Filter by</span>
            </div>
            {openFilter && (
               <div className='trans absolute lg:hidden py-4 border border-primary bg-white rounded shadow-sm w-full z-50 px-2'>
                  <h3 className='font-semibold mb-2 text-primary'>Price ($)</h3>
                  <div className='grid md:grid-cols-3 gap-x-2'>
                     <div className='mb-4'>
                        <input
                           name='min'
                           className='appearance-none border border-primary bg-white rounded-md py-2 px-3 focus:outline-none focus:border-primary/30 w-full trans'
                           type='number'
                           placeholder='Min'
                           value={min}
                           onChange={(e) => setMin(e.target.value)}
                        />
                     </div>

                     <div className='mb-4'>
                        <input
                           name='max'
                           className='appearance-none border border-primary bg-white rounded-md py-2 px-3  focus:outline-none focus:border-primary/30 w-full trans'
                           type='number'
                           placeholder='Max'
                           value={max}
                           onChange={(e) => setMax(e.target.value)}
                        />
                     </div>

                     <div className='mb-4'>
                        <button
                           className='px-1 py-2 text-center w-full inline-block text-white bg-primary border rounded-md hover:bg-primary/70 trans'
                           onClick={handleButtonClick}
                        >
                           Go
                        </button>
                     </div>
                  </div>

                  <div className='lg:hidden px-6 py-4 border border-primary bg-white rounded shadow-sm'>
                     <h3 className='font-semibold mb-2 text-primary'>
                        Category
                     </h3>
                     {categories?.map((category) => (
                        <ul key={category?.id} className='space-y-1'>
                           <li key={category?.id}>
                              <label className='flex items-center'>
                                 <input
                                    name='category'
                                    type='checkbox'
                                    value={category?.categoryName}
                                    className='h-4 w-4 accent-primary'
                                    defaultChecked={checkHandler(
                                       'category',
                                       `${category?.categoryName}`,
                                    )}
                                    onClick={(e) => handleClick(e.target)}
                                 />
                                 <span className='ml-2 text-primary capitalize'>
                                    {' '}
                                    {category?.categoryName}{' '}
                                 </span>
                              </label>
                           </li>
                        </ul>
                     ))}

                     <hr className='my-4' />

                     <h3 className='font-semibold mb-2 text-primary'>
                        Ratings
                     </h3>
                     <ul className='space-y-1'>
                        <li>
                           {rateArray.map((rating) => (
                              <label key={rating} className='flex items-center'>
                                 <input
                                    name='ratings'
                                    type='checkbox'
                                    value={rating}
                                    className='h-4 w-4 accent-primary'
                                    defaultChecked={checkHandler(
                                       'ratings',
                                       `${rating}`,
                                    )}
                                    onClick={(e) => handleClick(e.target)}
                                 />
                                 <span className='ml-2 text-primary'>
                                    {' '}
                                    <StarRatings
                                       rating={rating}
                                       starRatedColor='#4c1d95'
                                       numberOfStars={5}
                                       starDimension='18px'
                                       starSpacing='2px'
                                       name='rating'
                                    />{' '}
                                 </span>
                              </label>
                           ))}
                        </li>
                     </ul>
                  </div>
               </div>
            )}
         </div>

         {/* desktop starts here */}
         <div className='hidden lg:block px-2 border border-primary bg-white rounded shadow-sm'>
            <h3 className='font-semibold mb-2 text-primary py-2'>Price ($)</h3>
            <div className='grid md:grid-cols-3 gap-x-2'>
               <div className='mb-4'>
                  <input
                     name='min'
                     className='appearance-none border border-primary bg-white rounded-md p-1 focus:outline-none focus:border-primary/30 w-full trans text-sm'
                     type='text'
                     placeholder='Min'
                     value={min}
                     onChange={(e) => setMin(e.target.value)}
                  />
               </div>

               <div className='mb-4'>
                  <input
                     name='max'
                     className='appearance-none border border-primary bg-white rounded-md p-1  focus:outline-none focus:border-primary/30 w-full trans text-sm'
                     type='text'
                     placeholder='Max'
                     value={max}
                     onChange={(e) => setMax(e.target.value)}
                  />
               </div>

               <div className='mb-4'>
                  <button
                     onClick={handleButtonClick}
                     className='p-1 text-center w-full inline-block text-white bg-primary border rounded-md hover:bg-primary/70 text-sm trans'
                  >
                     Go
                  </button>
               </div>
            </div>
         </div>

         <div className='hidden lg:block px-2 py-4 border border-primary bg-white rounded shadow-sm'>
            <h3 className='font-semibold mb-2 text-primary'>Category</h3>
            {categories?.map((category) => (
               <ul key={category?.id} className='space-y-1'>
                  <li key={category?.id} className='space-y-3'>
                     <label className='flex items-center'>
                        <input
                           name='category'
                           type='checkbox'
                           value={category?.categoryName}
                           className='h-4 w-4 accent-primary'
                           defaultChecked={checkHandler(
                              'category',
                              `${category?.categoryName}`,
                           )}
                           onClick={(e) => handleClick(e.target)}
                        />
                        <span className='ml-2 text-primary capitalize text-xs md:text-sm truncate'>
                           {' '}
                           {category?.categoryName}{' '}
                        </span>
                     </label>
                  </li>
               </ul>
            ))}

            <hr className='my-4' />

            <h3 className='font-semibold mb-2 text-primary'>Ratings</h3>
            <ul className='space-y-1'>
               <li>
                  {rateArray.map((rating) => (
                     <label key={rating} className='flex items-center'>
                        <input
                           name='ratings'
                           type='checkbox'
                           value={rating}
                           className='h-4 w-4 accent-primary'
                           defaultChecked={checkHandler('ratings', `${rating}`)}
                           onClick={(e) => handleClick(e.target)}
                        />
                        <span className='ml-2 text-primary'>
                           {' '}
                           <StarRatings
                              rating={rating}
                              starRatedColor='#4c1d95'
                              numberOfStars={5}
                              starDimension='18px'
                              starSpacing='2px'
                              name='rating'
                           />{' '}
                        </span>
                     </label>
                  ))}
               </li>
            </ul>
         </div>
      </aside>
   );
};

export default Filters;
