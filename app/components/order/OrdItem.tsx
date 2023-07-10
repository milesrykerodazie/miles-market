'use client';
import Image from 'next/image';
import React, {FC, useState} from 'react';
import {format} from 'date-fns';
import {SafeUser, UserOrderType} from '@/app/types';
import {AiFillDelete} from 'react-icons/ai';
import Delete from '../modals/Delete';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';

interface UserOrderProp {
   userOrder: UserOrderType;
}

const OrdItem: FC<UserOrderProp> = ({userOrder}) => {
   //route navigation
   const route = useRouter();
   const [openModal, setOpenModal] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [orderId, setOrderId] = useState('');

   //delete order method
   const deleteOrder = async () => {
      try {
         setDeleting(true);
         const response = await axios.delete(`/api/delete-order/${orderId}`);
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
      <div className='relative'>
         <article className='  p-3 lg:p-5 mb-5 bg-white shadow-sm shadow-primary rounded-md'>
            <div className='flex justify-end pb-3'>
               <span
                  onClick={() => {
                     setOpenModal(true);
                     setOrderId(userOrder?.id);
                  }}
                  className='p-1 md:p-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer'
               >
                  <AiFillDelete />
               </span>
            </div>
            <header className='lg:flex justify-between mb-4'>
               <div className='mb-4 lg:mb-0 text-primary'>
                  <p className='font-semibold '>
                     <span className='text-sm md:text-base'>
                        Order ID: {userOrder?.id}{' '}
                     </span>
                     {userOrder?.orderStatus === 'Processing' ? (
                        <span className='text-red-500 text-xs md:text-sm'>
                           • Processing
                        </span>
                     ) : userOrder?.orderStatus === 'Shipped' ? (
                        <span className='text-yellow-600 text-xs md:text-sm'>
                           • Shipped
                        </span>
                     ) : userOrder?.orderStatus === 'Delivered' ? (
                        <span className='text-green-500 text-xs md:text-sm'>
                           • Delivered
                        </span>
                     ) : null}
                  </p>
                  <p className='font-light text-sm md:text-base'>
                     {' '}
                     {format(userOrder?.createdAt, 'MMM-dd-yyy')}{' '}
                  </p>
               </div>
            </header>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
               <div className='text-primary text-sm md:text-base'>
                  <p className=' mb-1'>Person</p>
                  <ul className='font-light text-xs md:text-sm'>
                     <li>Name:{userOrder?.user?.name}</li>
                     <li>Phone: {userOrder?.shippingInfo?.phoneNo} </li>
                     <li>Email: {userOrder?.user?.email}</li>
                  </ul>
               </div>
               <div className='text-primary text-sm md:text-base'>
                  <p className=' mb-1'>Delivery address</p>
                  <ul className='font-light text-xs md:text-sm'>
                     <li>{userOrder?.shippingInfo?.street}</li>
                     <li>
                        {userOrder?.shippingInfo?.city},{' '}
                        {userOrder?.shippingInfo?.state},{' '}
                     </li>
                     <li>{userOrder?.shippingInfo?.country}</li>
                  </ul>
               </div>
               <div className='text-primary col-span-2 md:col-span-1 text-sm md:text-base'>
                  <p className='mb-1'>Payment</p>
                  <ul className=''>
                     <li className='text-primary'>
                        Status:{' '}
                        <b className='text-green-400'>
                           {userOrder?.paymentInfo?.status.toUpperCase()}
                        </b>
                     </li>
                     <li>Tax paid: ${userOrder?.paymentInfo?.taxPaid}</li>
                     <li className='font-bold tracking-wide'>
                        Total paid: ${userOrder?.paymentInfo?.amountPaid}
                     </li>
                  </ul>
               </div>
            </div>

            <hr className='my-4' />

            <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
               {userOrder?.orderItems?.map((item) => (
                  <div key={item?.id} className='flex flex-row mb-4'>
                     <div>
                        <div className='overflow-hidden '>
                           <Image
                              src={item?.image}
                              height='60'
                              width='60'
                              alt={item.name}
                              className='col-span-1 object-cover shadow rounded border-2 border-gray-200 w-full h-10 bg-white'
                           />
                        </div>
                     </div>
                     <div className='ml-3 text-primary'>
                        <p className='text-sm md:text-base font-semibold'>
                           {item.name.substring(0, 10)}
                        </p>
                        <p className='font-light text-xs md:text-sm'>
                           {item.quantity}x = ${item.price * item.quantity}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </article>
         {openModal && (
            <Delete
               deleteEntry={deleteOrder}
               setOpenModal={setOpenModal}
               openModal={openModal}
               deleting={deleting}
            />
         )}
      </div>
   );
};

export default OrdItem;
