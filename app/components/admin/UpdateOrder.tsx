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

const OrderUpdate: FC<OrderTypes> = ({order}) => {
   //route navigation
   const route = useRouter();
   const [open, setOpen] = useState(false);
   const [orderStatus, setOrderStatus] = useState(order?.orderStatus);
   const [isUpdating, setIsUpdating] = useState(false);

   //disable update
   const disable = orderStatus === order?.orderStatus;

   //update order method
   const updateOrder = async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      e.preventDefault();
      setIsUpdating(true);
      try {
         const response = await axios.patch('/api/update-order', {
            orderId: order?.id,
            orderStatus,
         });
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
               route.refresh();
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
         setIsUpdating(false);
      } catch (error: any) {
         console.log('error => ', error?.response?.data);
      } finally {
         setIsUpdating(false);
         route.refresh();
      }
   };
   return (
      <article className='p-2 mb-5 bg-white'>
         <header className='lg:flex justify-between mb-4'>
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
                        {item.name.substring(0, 35)}
                     </p>
                     <p className='font-light text-xs md:text-sm'>
                        {item.quantity}x = ${item.price * item.quantity}
                     </p>
                  </div>
               </div>
            ))}
         </div>

         <div className='my-8 relative'>
            <label className='block mb-3 text-primary text-sm md:text-base '>
               {' '}
               Update Order Status{' '}
            </label>
            <div
               className='flex py-1 relative cursor-pointer'
               onClick={() => setOpen((current) => !current)}
            >
               <p className='border rounded-lg border-primary py-2 px-3 w-full text-primary capitalize tracking-wider select-none text-sm md:text-base '>
                  {orderStatus}
               </p>
               <div className='absolute right-2 top-3'>
                  {!open ? (
                     <MdKeyboardArrowRight className='w-4 h-4 lg:w-6 lg:h-6 text-primary' />
                  ) : (
                     <MdOutlineKeyboardArrowDown className='w-4 h-4 lg:w-6 lg:h-6 text-primary ' />
                  )}
               </div>
            </div>

            {/* select orderstatus */}
            {open && (
               <div className='bg-white shadow-sm shadow-primary absolute top-20 z-20 rounded overflow-y-auto w-full duration-500 ease-in space-y-1 mt-2 trans'>
                  {['Processing', 'Shipped', 'Delivered']?.map((status) => (
                     <p
                        key={status}
                        onClick={() => {
                           setOrderStatus(status);
                           setOpen((current) => !current);
                        }}
                        className='text-sm text-primary cursor-pointer hover:bg-primary hover:text-white trans select-none'
                     >
                        <span className='pl-2 '>{status}</span>
                     </p>
                  ))}
               </div>
            )}
         </div>

         <button
            onClick={updateOrder}
            disabled={disable}
            className={`my-2 px-4 py-2 text-center inline-block text-white bg-primary  font-semibold border border-transparent rounded-md w-full trans text-sm md:text-base  ${
               disable && 'cursor-not-allowed opacity-80'
            } `}
         >
            {isUpdating ? (
               <div className='gap-2 flex items-center justify-center'>
                  <span className='text-sm animate-pulse'>Updating...</span>
                  <FaSpinner className='animate-spin' />
               </div>
            ) : (
               'Update Order'
            )}
         </button>
      </article>
   );
};

export default OrderUpdate;
