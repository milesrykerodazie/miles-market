'use client';

import {UserOrderType} from '@/app/types';
import Image from 'next/image';
import React, {FC, useState} from 'react';
import {format} from 'date-fns';
import {MdKeyboardArrowRight, MdOutlineKeyboardArrowDown} from 'react-icons/md';
import {FaSpinner} from 'react-icons/fa';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';

interface OrderTypes {
   order: UserOrderType;
}

const Order: FC<OrderTypes> = ({order}) => {
   //route navigation
   const route = useRouter();

   return (
      <article className='p-2 mb-5 bg-white'>
         <header className='flex justify-between mb-4'>
            <div className='mb-4 lg:mb-0 text-primary'>
               <p className='font-semibold '>
                  <span className='text-sm md:text-base'>
                     Order ID: {order?.id}{' '}
                  </span>
                  {order?.orderStatus === 'Processing' ? (
                     <span className='text-red-500 text-xs md:text-sm'>
                        • Processing
                     </span>
                  ) : order?.orderStatus === 'Shipped' ? (
                     <span className='text-yellow-600 text-xs md:text-sm'>
                        • Shipped
                     </span>
                  ) : order?.orderStatus === 'Delivered' ? (
                     <span className='text-green-500 text-xs md:text-sm'>
                        • Delivered
                     </span>
                  ) : null}
               </p>
               <p className='font-light text-sm md:text-base'>
                  {' '}
                  {format(order?.createdAt, 'MMM-dd-yyy')}{' '}
               </p>
            </div>
            <span
               onClick={() => route.back()}
               className='text-sm md:text-base text-primary cursor-pointer'
            >
               back
            </span>
         </header>
         <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            <div className='text-primary text-sm md:text-base'>
               <p className=' mb-1'>Person</p>
               <ul className='font-light text-xs md:text-sm'>
                  <li>Name:{order?.user?.name}</li>
                  <li>Phone: {order?.shippingInfo?.phoneNo} </li>
                  <li>Email: {order?.user?.email}</li>
               </ul>
            </div>
            <div className='text-primary text-sm md:text-base'>
               <p className=' mb-1'>Delivery address</p>
               <ul className='font-light text-xs md:text-sm'>
                  <li>{order?.shippingInfo?.street}</li>
                  <li>
                     {order?.shippingInfo?.city}, {order?.shippingInfo?.state},{' '}
                  </li>
                  <li>{order?.shippingInfo?.country}</li>
               </ul>
            </div>
            <div className='text-primary col-span-2 md:col-span-1 text-sm md:text-base'>
               <p className='mb-1'>Payment</p>
               <ul className=''>
                  <li className='text-primary'>
                     Status:{' '}
                     <b className='text-green-400'>
                        {order?.paymentInfo?.status.toUpperCase()}
                     </b>
                  </li>
                  <li>Tax paid: ${order?.paymentInfo?.taxPaid}</li>
                  <li className='font-bold tracking-wide'>
                     Total paid: ${order?.paymentInfo?.amountPaid}
                  </li>
               </ul>
            </div>
         </div>

         <hr className='my-4' />

         <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
            {order?.orderItems?.map((item) => (
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
   );
};

export default Order;
