'use client';

import {SafeProduct, SafeUser} from '@/app/types';
import React, {FC, useRef} from 'react';
import StarRatings from 'react-star-ratings';
import {BsFillCartCheckFill} from 'react-icons/bs';
import AddReview from '../review/AddReview';
import Reviews from '../review/Reviews';
import {addItemToCart} from '../../state-management/features/cartSlice';
import {useAppDispatch} from '../../state-management/hooks';

interface IProduct {
   product: SafeProduct;
   userId: string;
   canReview: boolean;
}

const ProductDetails = ({product, userId, canReview}: IProduct) => {
   const allowReview = userId !== '' && canReview === true;

   //dispatch
   const dispatch = useAppDispatch();
   //items to add to cart
   const item = {
      productId: product?.id,
      name: product?.name,
      slug: product?.slug,
      price: product?.price,
      productImage: product?.productImage,
      stock: product?.stock,
      seller: product?.seller,
      quantity: 1,
   };
   const imgRef: React.MutableRefObject<HTMLImageElement | null> = useRef(null);

   const setImgPreview = (url: string) => {
      if (imgRef.current !== null) {
         imgRef.current.src = url;
      }
   };

   const inStock = product?.stock >= 1;

   return (
      <>
         {/* <BreadCrumbs breadCrumbs={breadCrumbs} /> */}

         <section className='bg-white py-10 rounded-md drop-shadow-md'>
            <div className='lg:max-w-screen-xl mx-auto px-4'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-5'>
                  <aside>
                     <div className='border border-gray-200 shadow-sm text-center rounded-md mb-5'>
                        <img
                           ref={imgRef}
                           className='object-cover w-full h-60 sm:h-[400px] inline-block rounded-md'
                           src={
                              product?.productImage
                                 ? product?.productImage
                                 : '/images/no-photo-available.png'
                           }
                           alt='Product title'
                        />
                     </div>
                     <div className='space-x-2 overflow-auto text-center whitespace-nowrap'>
                        {product?.productImages?.map((img) => (
                           <a
                              key={img.public_id}
                              className='inline-block shadow-sm shadow-primary p-0.5 rounded-md cursor-pointer'
                              onClick={() => setImgPreview(img.url)}
                           >
                              <img
                                 className='h-10 w-10 sm:w-14 sm:h-14 rounded-md'
                                 src={img.url}
                                 alt='Product title'
                              />
                           </a>
                        ))}
                     </div>
                  </aside>
                  <main>
                     <h2 className='font-semibold text-lg md:text-2xl mb-4 text-primary'>
                        {product?.name}
                     </h2>

                     <div className='flex flex-wrap items-center space-x-2 mb-2'>
                        <div className=''>
                           <StarRatings
                              rating={product.ratings ? product.ratings : 4}
                              starRatedColor='#4c1d95'
                              numberOfStars={5}
                              starDimension='20px'
                              starSpacing='2px'
                              name='rating'
                           />
                        </div>
                        <span className='text-yellow-400 font-semibold text-sm md:text-base'>
                           {product?.ratings}
                        </span>

                        <span className='text-green-500 text-sm md:text-base'>
                           ● Verified
                        </span>
                     </div>

                     <p className='mb-4 font-semibold md:text-xl text-primary'>
                        ${product?.price}
                     </p>

                     <p className='mb-4 text-primary text-sm md:text-base'>
                        {product?.description}
                     </p>

                     <div className='flex flex-wrap gap-2 mb-5'>
                        <button
                           onClick={() => dispatch(addItemToCart(item))}
                           className='px-4 flex items-center py-2 space-x-2 text-white bg-primary trans rounded-md hover:bg-primary/80 text-sm md:text-base'
                        >
                           <BsFillCartCheckFill />
                           <span>Add to cart</span>
                        </button>
                     </div>

                     <ul className='mb-5 text-sm md:text-base'>
                        <li className='mb-1'>
                           {' '}
                           <b className='font-medium w-36 inline-block text-primary'>
                              Stock
                           </b>
                           {inStock ? (
                              <span className='text-green-500'>In Stock</span>
                           ) : (
                              <span className='text-red-500'>Out of Stock</span>
                           )}
                        </li>
                        <li className='mb-1'>
                           {' '}
                           <b className='font-medium w-36 inline-block text-primary'>
                              Category:
                           </b>
                           <span className='text-primary'>
                              {product?.category}
                           </span>
                        </li>
                        <li className='mb-1'>
                           {' '}
                           <b className='font-medium w-36 inline-block text-primary'>
                              Seller:
                           </b>
                           <span className='text-primary'>
                              {product?.seller}
                           </span>
                        </li>
                     </ul>
                  </main>
               </div>

               {/* <NewReview /> */}
               {allowReview && <AddReview productId={product?.id} />}

               <hr />

               <div className='font-semibold'>
                  <h1 className='text-primary mb-6 mt-6 md:mt-10 md:text-2xl'>
                     Other Customers Reviews
                  </h1>
                  {/* the product reviews */}
                  <Reviews reviews={product?.comments} userId={userId} />
               </div>
            </div>
         </section>
      </>
   );
};

export default ProductDetails;
