'use client';

import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {AiFillEdit, AiFillDelete} from 'react-icons/ai';
import {useState} from 'react';
import Delete from '../modals/Delete';
import {toast} from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import Update from '../modals/Update';

interface CatProps {
   id: string;
   categoryName: string;
}

interface CategoriesTypes {
   categories: CatProps[];
}

const AllCategories: React.FC<CategoriesTypes> = ({categories}) => {
   //next route
   const route = useRouter();

   //pagination section
   //states for pagenation
   const [pageNumber, setPageNumber] = useState(0);

   const categoriesPerPage = 6;
   const pagesVisited = pageNumber * categoriesPerPage;

   //the page count
   const pageCount = Math.ceil(categories?.length / categoriesPerPage);

   //on change for select page
   const changePage = ({selected}: {selected: number}) => {
      setPageNumber(selected);
   };
   const showNextButton = pagesVisited !== categories?.length - 1;
   const showPrevButton = pagesVisited !== 0;

   //other states
   const [catId, setCatId] = useState('');
   const [openModal, setOpenModal] = useState(false);
   const [openEdit, setOpenEdit] = useState(false);
   const [deleting, setDeleting] = useState(false);

   //delete product function
   const deleteProduct = async () => {
      setDeleting(true);

      try {
         const deleteRes = await axios.delete(`/api/category/${catId}/delete`);
         if (deleteRes.data) {
            if (deleteRes?.data?.success === true) {
               toast.success(deleteRes?.data?.message);
            }
            if (deleteRes?.data?.success === false) {
               toast.error(deleteRes?.data?.message);
            }
         }
      } catch (error) {
         console.log(error);
      } finally {
         setDeleting(false);
         setOpenModal(false);
         route.refresh();
      }
   };

   return (
      <div className='relative overflow-x-auto w-full '>
         <h1 className='text-base lg:text-xl my-2 lg:my-5 mx-1 lg:ml-4 font-bold text-primary'>
            {categories?.length} Categories
         </h1>
         <table className='w-full text-sm text-left'>
            <thead className=' text-gray-700 uppercase text-xs md:text-sm lg:text-lg'>
               <tr className='text-primary'>
                  <th scope='col' className='px-6 py-3'>
                     Name
                  </th>

                  <th scope='col' className='px-6 py-3'>
                     Actions
                  </th>
               </tr>
            </thead>
            <tbody className='text-xs md:text-sm lg:text-lg '>
               {categories?.length > 0 ? (
                  <>
                     {categories
                        ?.slice(pagesVisited, pagesVisited + categoriesPerPage)
                        .map((category) => (
                           <tr key={category.id}>
                              <td className='px-6 py-2 text-primary truncate capitalize'>
                                 {category?.categoryName}
                              </td>

                              <td className='px-6 py-2 text-primary'>
                                 <div className='flex flex-row items-center'>
                                    <span
                                       onClick={() => {
                                          setOpenEdit(true);
                                          setCatId(category?.id);
                                       }}
                                       className='px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2'
                                    >
                                       <AiFillEdit />
                                    </span>
                                    <span
                                       onClick={() => {
                                          setOpenModal(true);
                                          setCatId(category?.id);
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
               ) : (
                  <>
                     <div className='text-primary text-sm'>
                        <p>No product for now</p>
                     </div>
                  </>
               )}
            </tbody>
            {openModal && (
               <Delete
                  deleteEntry={deleteProduct}
                  setOpenModal={setOpenModal}
                  openModal={openModal}
                  deleting={deleting}
               />
            )}
            {openEdit && (
               <Update
                  setOpenEdit={setOpenEdit}
                  openEdit={openEdit}
                  catId={catId}
               />
            )}
         </table>
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

export default AllCategories;
