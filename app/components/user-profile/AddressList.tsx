'use client';

import {Address, UserType} from '@prisma/client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {FC, useState} from 'react';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai';
import {BiCurrentLocation} from 'react-icons/bi';
import Delete from '../modals/Delete';
import axios from 'axios';
import {toast} from 'react-hot-toast';

interface UserRole {
   role: UserType;
   addresses: Address[];
}

const AddressList: FC<UserRole> = ({role, addresses}) => {
   //next route
   const router = useRouter();
   const [openModal, setOpenModal] = useState(false);
   const [addressId, setAddressId] = useState('');
   const [deleting, setDeleting] = useState(false);

   const deleteAddress = async () => {
      setDeleting(true);

      try {
         const deleteRes = await axios.delete(
            `/api/address/${addressId}/delete`,
         );
         if (deleteRes.data) {
            if (deleteRes?.data?.success === true) {
               toast.success(deleteRes?.data?.message);
            }
            if (deleteRes?.data?.success === false) {
               toast.error(deleteRes?.data?.message);
            }
         }
      } catch (error) {
      } finally {
         setDeleting(false);
         setOpenModal(false);
         router.refresh();
      }
   };
   return (
      <div className='relative'>
         <h1 className='text-primary lg:text-xl font-bold'>My Addresses</h1>

         {addresses?.length > 0 ? (
            addresses?.map((address) => (
               <div key={address?.id} className='mb-5 gap-4'>
                  <div className='w-full flex justify-between space-x-3 bg-white p-4 rounded-md cursor-pointer drop-shadow-md'>
                     <div className='flex'>
                        <div className='mr-3'>
                           <span className='flex items-center justify-center text-primary w-6 h-6 lg:w-12 lg:h-12 bg-white rounded-full shadow mt-2'>
                              <BiCurrentLocation className='w-5 h-5 lg:w-8 lg:h-8' />
                           </span>
                        </div>
                        <div className='text-primary'>
                           <p className='text-sm lg:text-base'>
                              {address.street} <br /> {address.city},{' '}
                              {address.state}, {address.country}
                              <br />
                              Phone no: {address.phoneNo}
                           </p>
                        </div>
                     </div>
                     {/* the actions */}
                     <div className='flex items-center flex-row'>
                        <Link
                           href={
                              role === 'ADMIN'
                                 ? `/admin-dashboard/address/${address.id}/edit`
                                 : role === 'USER'
                                 ? `/user-dashboard/address/${address.id}/edit`
                                 : '/'
                           }
                           className='px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-primary/50 rounded-md  cursor-pointer mr-4'
                        >
                           <AiFillEdit />
                        </Link>
                        <span
                           onClick={() => {
                              setOpenModal(true);
                              setAddressId(address?.id);
                           }}
                           className='px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-primary/50 rounded-md cursor-pointer'
                        >
                           <AiFillDelete />
                        </span>
                     </div>
                  </div>
               </div>
            ))
         ) : (
            <div className='text-sm lg:text-base'>No addresses available.</div>
         )}
         {openModal && (
            <Delete
               deleteEntry={deleteAddress}
               setOpenModal={setOpenModal}
               openModal={openModal}
               deleting={deleting}
            />
         )}
         {/* add a new addreess */}
         <div className='flex justify-end'>
            {addresses?.length === 3 ? (
               <span className=' cursor-default mt-5 border p-2 border-red-600 text-primary rounded-md text-sm font-semibold'>
                  Max addresses reached.
               </span>
            ) : (
               <Link
                  href={
                     role === 'ADMIN'
                        ? '/admin-dashboard/address/new'
                        : role === 'USER'
                        ? '/user-dashboard/address/new'
                        : '/'
                  }
                  className='mt-5 border p-2 text-primary rounded-md text-sm font-semibold'
               >
                  Add address
               </Link>
            )}
         </div>
      </div>
   );
};

export default AddressList;
