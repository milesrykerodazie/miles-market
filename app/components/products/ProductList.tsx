'use client';

import React, {FC, useEffect, useState} from 'react';
import Filters from '../Filters';
import ProductItem from './ProductItem';
import {SafeProduct} from '@/app/types';
import ReactPaginate from 'react-paginate';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import {useRouter} from 'next/navigation';

interface ProductsProps {
   products: SafeProduct[];
   categories?: {
      id: string;
      categoryName: string;
   }[];
}

const ProductList: FC<ProductsProps> = ({products, categories}) => {
   //router
   const route = useRouter();
   //states for pagenation
   const [pageNumber, setPageNumber] = useState(0);

   const productPerPage = 4;

   useEffect(() => {
      if (productPerPage < 1) {
         route.refresh();
      }
   }, [productPerPage]);
   const pagesVisited = pageNumber * productPerPage;

   //the page count
   const pageCount = Math.ceil(products?.length / productPerPage);
   //on change for select page
   const changePage = ({selected}: {selected: number}) => {
      setPageNumber(selected);
   };

   const showNextButton = pagesVisited !== products?.length - 1;
   const showPrevButton = pagesVisited !== 0;
   return (
      <section className='py-5 h-auto'>
         <div className='lg:max-w-screen-xl mx-auto px-4'>
            <div className='flex flex-col lg:flex-row -mx-4'>
               <Filters categories={categories} />

               <main className='lg:w-3/4 lg:px-3 trans'>
                  {products?.length > 0 ? (
                     <>
                        {products
                           ?.slice(pagesVisited, pagesVisited + productPerPage)
                           .map((product) => (
                              <ProductItem
                                 key={product?.id}
                                 product={product}
                              />
                           ))}
                     </>
                  ) : (
                     <>
                        <div className='text-primary dark:text-white trans flex justify-center text-sm'>
                           <p className='text-2xl'>No product for now.</p>
                        </div>
                     </>
                  )}

                  {pageCount > 1 && (
                     <ReactPaginate
                        breakLabel={<span className='pr-4'>...</span>}
                        pageCount={pageCount}
                        nextLabel={
                           showNextButton ? (
                              <span className='w-10 h-10 flex items-center justify-center bg-white text-primary rounded-md'>
                                 <BsChevronRight />
                              </span>
                           ) : null
                        }
                        onPageChange={changePage}
                        pageRangeDisplayed={2}
                        previousLabel={
                           showPrevButton ? (
                              <span className='w-10 h-10 flex items-center justify-center bg-white text-primary rounded-md mr-4'>
                                 <BsChevronLeft />
                              </span>
                           ) : null
                        }
                        containerClassName='flex items-center justify-center mt-8 mb-4 dark:bg-white rounded-md'
                        pageClassName='block text-primary border border-solid border-primary hover:text-white hover:bg-primary/80 w-8 h-8 flex items-center justify-center rounded-md mr-4 trans'
                        activeClassName='bg-primary text-white'
                        renderOnZeroPageCount={null}
                     />
                  )}
               </main>
            </div>
         </div>
      </section>
   );
};

export default ProductList;
