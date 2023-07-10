'use client';

import {SafeProduct} from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';
import React, {FC} from 'react';
import StarRatings from 'react-star-ratings';

interface ProductProp {
   product: SafeProduct;
}

const AdminProductItem: FC<ProductProp> = ({product}) => {
   return (
      <article className='border border-primary overflow-hidden bg-primarywhite shadow-md shadow-primary rounded mb-5'>
         <div className='flex flex-col lg:flex-row'>
            <div className='lg:w-1/4 flex p-3'>
               <div className='relative'>
                  <img
                     src={
                        product?.productImage
                           ? product?.productImage
                           : '/images/no-photo-available.png'
                     }
                     alt='product name'
                     className='w-full lg:w-60'
                  />
               </div>
            </div>
            <div className='lg:w-2/4'>
               <div className='p-4'>
                  <Link
                     href={`/product/${product.slug}`}
                     className='text-primary hover:text-primary/70 trans font-semibold'
                  >
                     {product.name}
                  </Link>
                  <div className='flex flex-wrap items-center space-x-2 mb-2'>
                     <div className='ratings'>
                        <div className='my-1'>
                           <StarRatings
                              rating={product.ratings}
                              starRatedColor='#facc15'
                              numberOfStars={5}
                              starDimension='18px'
                              starSpacing='1px'
                              name='rating'
                           />
                        </div>
                     </div>
                     <b className='text-primary'>•</b>
                     <span className='ml-1 text-yellow-400 font-semibold'>
                        {product?.ratings}
                     </span>
                  </div>
                  <p className='text-primary mb-2'>
                     {product?.description.substring(0, 150)}...
                  </p>
               </div>
            </div>
            <div className='lg:w-1/4 border-t lg:border-t-0 lg:border-l border-primary'>
               <div className='p-5'>
                  <span className='text-xl font-semibold text-primary'>
                     ${product?.price}
                  </span>

                  <p className='text-primary'>Free Shipping</p>
                  <div className='my-3'>
                     <Link
                        href={`/dashboard/products/${product.slug}/edit`}
                        className='px-4 py-2 inline-block text-primarywhite bg-primary border border-transparent rounded-md hover:bg-primary/80 cursor-pointer'
                     >
                        Edit Product
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </article>
   );
};

export default AdminProductItem;
