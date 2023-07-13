'use client';

import {SafeProduct} from '@/app/types';
import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {AiFillEdit, AiFillDelete} from 'react-icons/ai';
import {useEffect, useState} from 'react';
import Delete from '../modals/Delete';
import {toast} from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

interface ProductsProps {
   products: SafeProduct[];
}

const Products: React.FC<ProductsProps> = ({products}) => {
   //next route
   const router = useRouter();
   //pagination section
   //states for pagenation
   const [pageNumber, setPageNumber] = useState(0);
   const productPerPage = 4;

   useEffect(() => {
      if (productPerPage < 1) {
         router.refresh();
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

   //other states
   const [productSlug, setProductSlug] = useState('');
   const [openModal, setOpenModal] = useState(false);
   const [deleting, setDeleting] = useState(false);

   //delete product function
   const deleteProduct = async () => {
      setDeleting(true);

      try {
         const deleteRes = await axios.delete(
            `/api/product/${productSlug}/delete`,
         );
         if (deleteRes?.data) {
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
         router.refresh();
      }
   };

   return (
      <div className='relative overflow-x-auto '>
         <h1 className='lg:text-3xl my-2 lg:my-5 mx-1 lg:ml-4 font-bold text-primary'>
            {products?.length} Products
         </h1>
         <table className='w-full text-sm text-left'>
            <thead className=' text-gray-700 uppercase text-xs md:text-sm lg:text-lg'>
               <tr className='text-primary'>
                  <th scope='col' className='px-6 py-3'>
                     Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Stock
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Price
                  </th>
                  <th scope='col' className='px-6 py-3'>
                     Actions
                  </th>
               </tr>
            </thead>
            <tbody className='text-xs md:text-sm lg:text-lg'>
               {products?.length > 0 ? (
                  <>
                     {products
                        ?.slice(pagesVisited, pagesVisited + productPerPage)
                        .map((product) => (
                           <tr key={product.id}>
                              <Link href={`/product/${product.slug}`}>
                                 <td className='px-6 py-2 text-primary truncate'>
                                    {product?.name}
                                 </td>
                              </Link>
                              <td className='px-6 py-2 text-primary'>
                                 {product?.stock}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 ${product?.price}
                              </td>
                              <td className='px-6 py-2 text-primary'>
                                 <div className='flex flex-row items-center'>
                                    <Link
                                       href={`/admin-dashboard/products/${product?.slug}/edit`}
                                       className='px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2'
                                    >
                                       <AiFillEdit />
                                    </Link>
                                    <span
                                       onClick={() => {
                                          setOpenModal(true);
                                          setProductSlug(product?.slug);
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
         </table>

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

export default Products;
