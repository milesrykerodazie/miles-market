'use client';
import React, {FC, useState} from 'react';
import OrdItem from './OrdItem';
import {UserOrderType} from '@/app/types';
import ReactPaginate from 'react-paginate';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import Link from 'next/link';

interface UserOrdersTypes {
   userOrders: UserOrderType[];
}

const OrdersPage: FC<UserOrdersTypes> = ({userOrders}) => {
   //states for pagenation
   const [pageNumber, setPageNumber] = useState(0);

   const orderPerPage = 2;
   const pagesVisited = pageNumber * orderPerPage;
   //the page count
   const pageCount = Math.ceil(userOrders?.length / orderPerPage);
   //on change for select page
   const changePage = ({selected}: {selected: number}) => {
      setPageNumber(selected);
   };

   const showNextButton = pagesVisited !== userOrders?.length - 1;
   const showPrevButton = pagesVisited !== 0;
   return (
      <div>
         {' '}
         {userOrders?.length > 0 && (
            <h3 className='md:text-xl font-semibold mb-5 text-primary'>
               My Orders
            </h3>
         )}
         {userOrders?.length > 0 ? (
            userOrders
               ?.slice(pagesVisited, pagesVisited + orderPerPage)
               .map((userOder) => (
                  <div key={userOder?.id}>
                     <OrdItem key={userOder?.id} userOrder={userOder} />
                  </div>
               ))
         ) : (
            <section className='py-10'>
               <div className='max-w-screen-xl mx-auto px-4 bg-white'>
                  <div className='flex flex-col items-center justify-center space-y-5'>
                     <h2 className='md:text-2xl font-semibold text-primary'>
                        You Have No Orders.
                     </h2>
                     <p className='text-primary leading-relaxed text-sm md:text-base'>
                        Checkout Our Amazing Products And Place An Order
                     </p>
                     <Link
                        href='/'
                        className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded inline-block text-sm md:text-base'
                     >
                        Start Shopping
                     </Link>
                  </div>
               </div>
            </section>
         )}
         {pageCount > 1 && (
            <ReactPaginate
               breakLabel='...'
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
               pageClassName='block text-primary border border-solid border-primary hover:text-white hover:bg-primary/80 w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center rounded-md mr-4 trans'
               activeClassName='bg-primary text-white'
               renderOnZeroPageCount={null}
            />
         )}
      </div>
   );
};

export default OrdersPage;
