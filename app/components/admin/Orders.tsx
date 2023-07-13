'use client';
import {UserOrderType} from '@/app/types';
import Link from 'next/link';
import React, {FC, useState} from 'react';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai';
import Delete from '../modals/Delete';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import {BsChevronLeft, BsChevronRight, BsFillCartXFill} from 'react-icons/bs';
import ReactPaginate from 'react-paginate';

interface UserOrdersTypes {
   allOrders: UserOrderType[];
}

const Orders: FC<UserOrdersTypes> = ({allOrders}) => {
   //route navigation
   const route = useRouter();
   const [openModal, setOpenModal] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [orderId, setOrderId] = useState('');

   //pagination section
   //states for pagenation
   const [pageNumber, setPageNumber] = useState(0);

   const ordersPerPage = 5;
   const pagesVisited = pageNumber * ordersPerPage;
   //the page count
   const pageCount = Math.ceil(allOrders?.length / ordersPerPage);

   //on change for select page
   const changePage = ({selected}: {selected: number}) => {
      setPageNumber(selected);
   };

   const showNextButton = pagesVisited !== allOrders?.length - 1;
   const showPrevButton = pagesVisited !== 0;

   //delete order method
   const deleteOrder = async () => {
      try {
         setDeleting(true);
         const response = await axios.delete(
            `/api/orders/delete-order/${orderId}`,
         );
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
               setOpenModal(false);
               route.refresh();
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
               setOpenModal(false);
            }
         }
      } catch (error: any) {
         console.log('error => ', error?.response?.data);
      } finally {
         setDeleting(false);
         setOpenModal(false);
         route.refresh();
      }
   };
   return (
      <>
         {allOrders?.length > 0 ? (
            <div className='relative overflow-x-auto '>
               <h1 className='lg:text-3xl my-2 lg:my-5 mx-1 lg:ml-4 font-bold text-primary'>
                  {allOrders?.length} Orders
               </h1>
               <table className='w-full text-left'>
                  <thead className='text-primary uppercase text-xs md:text-sm lg:text-lg'>
                     <tr>
                        <th scope='col' className='px-6 py-3'>
                           ID
                        </th>
                        <th scope='col' className='px-6 py-3 truncate'>
                           Amount Paid
                        </th>
                        <th scope='col' className='px-6 py-3'>
                           Status
                        </th>
                        <th scope='col' className='px-6 py-3'>
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className='text-xs md:text-sm lg:text-lg'>
                     {allOrders
                        ?.slice(pagesVisited, pagesVisited + ordersPerPage)
                        .map((order) => (
                           <tr
                              key={order?.id}
                              className='bg-white text-primary'
                           >
                              <Link
                                 href={`/admin-dashboard/orders/${order?.id}`}
                              >
                                 <td className='px-6 py-2 text-primary truncate'>
                                    {order?.id}
                                 </td>
                              </Link>
                              <td className='px-6 py-2 text-primary'>
                                 ${order?.paymentInfo?.amountPaid}
                              </td>
                              <td className='px-6 py-2'>
                                 {order?.orderStatus}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 <div className='flex flex-row items-center'>
                                    <Link
                                       href={`/admin-dashboard/orders/${order?.id}/update-order`}
                                       className='px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-primary/20 cursor-pointer mr-2 trans'
                                    >
                                       <AiFillEdit />
                                    </Link>
                                    <span
                                       className='px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-primary/20 cursor-pointer trans'
                                       onClick={() => {
                                          setOpenModal(true);
                                          setOrderId(order?.id);
                                       }}
                                    >
                                       <AiFillDelete />
                                    </span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
               {openModal && (
                  <Delete
                     deleteEntry={deleteOrder}
                     setOpenModal={setOpenModal}
                     openModal={openModal}
                     deleting={deleting}
                  />
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
                     pageClassName='block text-primary border border-solid border-primary hover:text-white hover:bg-primary/80 w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center rounded-md mr-4 trans'
                     activeClassName='bg-primary text-white'
                     renderOnZeroPageCount={null}
                  />
               )}
            </div>
         ) : (
            <section className='py-10'>
               <div className='lg:max-w-screen-xl mx-auto px-4 bg-white flex items-center justify-center'>
                  <h2 className='lg:text-2xl font-semibold text-primary animate-pulse'>
                     There are no orders!
                  </h2>
               </div>
            </section>
         )}
      </>
   );
};

export default Orders;
