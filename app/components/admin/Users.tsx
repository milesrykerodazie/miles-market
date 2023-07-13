'use client';

import {SafeUser} from '@/app/types';
import Link from 'next/link';
import React, {FC, useState} from 'react';
import {AiFillDelete, AiFillEdit} from 'react-icons/ai';
import Delete from '../modals/Delete';
import ReactPaginate from 'react-paginate';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';

interface UsersProps {
   users: SafeUser[];
}

const Users: FC<UsersProps> = ({users}) => {
   //next route
   const router = useRouter();
   //pagination section
   //states for pagenation
   const [pageNumber, setPageNumber] = useState(0);

   const usersPerPage = 5;
   const pagesVisited = pageNumber * usersPerPage;

   //the page count
   const pageCount = Math.ceil(users?.length / usersPerPage);

   //on change for select page
   const changePage = ({selected}: {selected: number}) => {
      setPageNumber(selected);
   };
   const showNextButton = pagesVisited !== users?.length - 1;
   const showPrevButton = pagesVisited !== 0;

   //other states
   const [userId, setUserId] = useState('');
   const [openModal, setOpenModal] = useState(false);
   const [deleting, setDeleting] = useState(false);

   //delete a user
   const deleteUser = async () => {
      setDeleting(true);

      if (userId === '') {
         return;
      }

      try {
         const deleteRes = await axios.delete(
            `/api/user/${userId}/admin-delete`,
         );
         if (deleteRes.data) {
            if (deleteRes?.data?.success === true) {
               toast.success(deleteRes?.data?.message);
               setDeleting(false);
               setOpenModal(false);
            }
            if (deleteRes?.data?.success === false) {
               toast.error(deleteRes?.data?.message);
               setDeleting(false);
               setOpenModal(false);
            }
         }
      } catch (error) {
         console.log(error);
      } finally {
         router.refresh();
      }
   };
   return (
      <div className='relative overflow-x-auto '>
         <h1 className='lg:text-3xl my-2 lg:my-5 mx-1 lg:ml-4 font-bold text-primary'>
            {users?.length} Users
         </h1>
         <table className='w-full text-sm text-left'>
            <thead className='text-gray-700 uppercase text-xs md:text-sm lg:text-lg'>
               <tr className='text-primary'>
                  <th scope='col' className='px-6 py-3'>
                     Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Username
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Email
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Role
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Actions
                  </th>
               </tr>
            </thead>
            <tbody className='text-xs md:text-sm lg:text-lg'>
               {users?.length > 0 && (
                  <>
                     {users
                        ?.slice(pagesVisited, pagesVisited + usersPerPage)
                        .map((user) => (
                           <tr key={user.id}>
                              <td className='px-6 py-2 text-primary truncate'>
                                 {user?.name}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 {user?.username}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 {user?.email}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 {user?.role}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 <div className='flex flex-row items-center'>
                                    <Link
                                       href={`/admin-dashboard/users/${user?.id}/edit`}
                                       className='px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2'
                                    >
                                       <AiFillEdit />
                                    </Link>
                                    <span
                                       onClick={() => {
                                          setOpenModal(true);
                                          setUserId(user?.id);
                                       }}
                                       className='px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer'
                                    >
                                       <AiFillDelete />
                                    </span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                  </>
               )}
            </tbody>
            {openModal && (
               <Delete
                  deleteEntry={deleteUser}
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                  deleting={deleting}
               />
            )}
         </table>
         {users?.length === 0 && (
            <span className='text-primary text-sm'>No users available.</span>
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
   );
};

export default Users;
