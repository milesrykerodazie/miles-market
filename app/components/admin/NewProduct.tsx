'use client';

import getCurrentUser from '@/app/actions/getCurrentUser';
import {SafeUser} from '@/app/types';
import axios from 'axios';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import React, {FC, useState} from 'react';
import {toast} from 'react-hot-toast';
import {AiFillCloseCircle} from 'react-icons/ai';
import {FaSpinner} from 'react-icons/fa';
import {
   MdOutlineKeyboardArrowDown,
   MdKeyboardArrowRight,
   MdRemoveCircle,
} from 'react-icons/md';

interface CatProps {
   id: string;
   categoryName: string;
}

interface UserProps {
   currentUser?: SafeUser | null | undefined;
   catList: CatProps[];
}

interface FormData {
   name: string;
   price: string;
   description: string;
   stock: string;
   seller: string;
   productImages: string[];
}

const NewProduct: FC<UserProps> = ({currentUser, catList}) => {
   //next route
   const router = useRouter();

   // the states
   const [product, setProduct] = useState<FormData>({
      name: '',
      description: '',
      seller: currentUser?.username!,
      price: '',
      stock: '',
      productImages: [],
   });
   const [category, setCategory] = useState('');
   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const {name, description, seller, price, stock, productImages} = product;

   const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      const {name, value} = event.target;
      setProduct((prevFormData) => ({
         ...prevFormData,
         [name]: value,
      }));
   };

   //handling the onChange of the images,
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
         const selectedImages = Array.from(files);

         // Convert selected images to base64
         const imagePromises = selectedImages.map((image: File) => {
            return new Promise<string>((resolve) => {
               const reader = new FileReader();
               reader.onloadend = () => {
                  const base64String = reader.result as string;
                  resolve(base64String);
               };
               reader.readAsDataURL(image);
            });
         });

         // Wait for all images to be converted to base64
         Promise.all(imagePromises)
            .then((base64Images: string[]) => {
               setProduct((prevFormData) => ({
                  ...prevFormData,
                  productImages: [
                     ...prevFormData.productImages,
                     ...base64Images,
                  ],
               }));
            })
            .catch((error) => {
               // Handle any errors that occurred during base64 conversion
               console.error('Error converting images to base64:', error);
            });
      }
   };

   //removing specific image fom the selected images
   const removeImage = (index: number) => {
      setProduct((prevFormData) => {
         const updatedImages = [...prevFormData.productImages];
         updatedImages.splice(index, 1);
         return {
            ...prevFormData,
            productImages: updatedImages,
         };
      });
   };

   const canSubmit = [...Object.values(product)].every(Boolean) && category;

   const newProductData = {
      name,
      description,
      seller,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      productImages,
   };

   //create product method
   const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (!canSubmit) {
         toast.error('Check all fields.');
         return;
      }

      if (newProductData.productImages.length > 5) {
         toast.error('Images can not be more than 5.');
         return;
      }

      try {
         const response = await axios.post(
            '/api/product/create',
            newProductData,
         );
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
               setProduct({
                  name: '',
                  description: '',
                  seller: currentUser?.username!,
                  price: '',
                  stock: '',
                  productImages: [],
               });
               setCategory('');
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
      } catch (error: any) {
         toast.success('Something went wrong.');
      } finally {
         setIsLoading(false);
         router.refresh();
      }
   };

   return (
      <form onSubmit={createProduct} className='space-y-5'>
         <div className='flex flex-col lg:flex-row gap-3 w-full'>
            {/* add product section */}
            <section className=' bg-white p-2 lg:p-6 rounded-lg drop-shadow-md lg:w-[60%] w-full'>
               <h1 className='mb-3 text-lg md:text-3xl font-semibold text-primary'>
                  Create New Product
               </h1>

               <>
                  <div className='mb-4'>
                     <label className='block mb-1 text-primary text-sm md:text-base'>
                        {' '}
                        Name{' '}
                     </label>
                     <input
                        type='text'
                        className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-sm md:text-base text-primary'
                        placeholder='Product name'
                        name='name'
                        value={name}
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className='mb-4 mt-5'>
                     <label className='block mb-1 text-primary text-sm md:text-base'>
                        {' '}
                        Description{' '}
                     </label>
                     <textarea
                        rows={4}
                        className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-sm md:text-base text-primary'
                        placeholder='Product description'
                        name='description'
                        value={description}
                        onChange={handleChange}
                        required
                     ></textarea>
                  </div>

                  <div className='grid md:grid-cols-2 gap-x-2 mt-5'>
                     <div className='mb-4'>
                        <label className='block mb-1 text-primary text-sm md:text-base'>
                           {' '}
                           Price{' '}
                        </label>
                        <div className='relative'>
                           <div className='col-span-2'>
                              <input
                                 type='text'
                                 className='appearance-none border border-primary bg-white rounded-md py-2 px-3 outline-none w-full text-sm md:text-base text-primary'
                                 placeholder='0.00'
                                 name='price'
                                 value={price}
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        </div>
                     </div>

                     {/* custom select option */}

                     <div className='md:flex-1 relative'>
                        <label
                           htmlFor='category'
                           className='text-primary text-sm md:text-base'
                        >
                           Category
                        </label>
                        <div
                           className='flex py-1 relative cursor-pointer'
                           onClick={() => setOpen((current) => !current)}
                        >
                           <p className='border rounded-lg border-primary py-2 pl-3 pr-3 w-full text-primary capitalize tracking-wider text-sm md:text-base'>
                              {category === '' ? 'Select Category' : category}
                           </p>
                           <div className='absolute right-0 top-3'>
                              {!open ? (
                                 <MdKeyboardArrowRight className='w-4 h-4 lg:w-6 lg:h-6 text-primary' />
                              ) : (
                                 <MdOutlineKeyboardArrowDown className='w-4 h-4 lg:w-6 lg:h-6 text-primary ' />
                              )}
                           </div>
                        </div>
                        {/* select category */}
                        {open && (
                           <div className='bg-white shadow-sm shadow-primary absolute top-20 z-20 rounded h-36 overflow-y-auto w-full duration-500 ease-in space-y-1'>
                              {catList?.length > 0 &&
                                 catList.map((category) => (
                                    <p
                                       key={category.id}
                                       onClick={() => {
                                          setCategory(category.categoryName);
                                          setOpen((current) => !current);
                                       }}
                                       className='text-sm text-primary cursor-pointer hover:bg-primary hover:text-white trans select-none'
                                    >
                                       <span className='pl-2 '>
                                          {category.categoryName
                                             ? category.categoryName
                                             : 'Select Category'}
                                       </span>
                                    </p>
                                 ))}
                           </div>
                        )}
                     </div>
                  </div>

                  <div className='grid md:grid-cols-2 gap-x-2 mt-5'>
                     <div className='mb-4'>
                        <label className='block mb-1 text-primary text-sm md:text-base'>
                           {' '}
                           Seller{' '}
                        </label>
                        <input
                           type='text'
                           className='appearance-none border border-primary bg-white rounded-md py-2 px-3 focus:outline-none w-full text-sm md:text-base text-primary'
                           placeholder='Seller'
                           name='seller'
                           value={seller}
                           onChange={handleChange}
                           required
                        />
                     </div>

                     <div className='mb-4'>
                        <label className='block mb-1 text-primary text-sm md:text-base'>
                           {' '}
                           Stock{' '}
                        </label>
                        <div className='relative'>
                           <div className='col-span-2'>
                              <input
                                 type='text'
                                 className='appearance-none border border-primary bg-white rounded-md py-2 px-3 focus:outline-none w-full text-sm md:text-base text-primary'
                                 placeholder='0'
                                 name='stock'
                                 value={stock}
                                 onChange={handleChange}
                                 required
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            </section>

            {/* add product images section */}
            <section className='bg-white p-6 rounded-lg drop-shadow-md lg:w-[40%] w-full'>
               <>
                  <h2 className='mb-3 text-sm md:text-2xl font-semibold text-primary'>
                     Upload Product Images
                  </h2>

                  <div className='mb-4 flex flex-col md:flex-row'>
                     <div className='w-full'>
                        <input
                           className='form-control block w-full px-2 py-1.5 font-normal bg-white bg-clip-padding shadow-sm shadow-primary rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-8 text-sm md:text-base text-primary'
                           type='file'
                           id='formFile'
                           multiple
                           onChange={handleFileChange}
                        />
                     </div>
                  </div>

                  <div className='grid grid-cols-6 gap-2 my-5'>
                     {productImages?.map((img, index) => (
                        <div className='relative' key={index}>
                           <Image
                              src={img}
                              key={index}
                              alt='Preview'
                              className='col-span-1 object-contain shadow rounded border-2 border-gray-200 p-1 h-full w-full bg-white'
                              width='50'
                              height='50'
                           />
                           <AiFillCloseCircle
                              className='absolute -top-2 text-red-600 w-7 h-7 -right-1 cursor-pointer'
                              onClick={() => removeImage(index)}
                           />
                        </div>
                     ))}
                  </div>
               </>
            </section>
         </div>

         <button
            type='submit'
            disabled={!canSubmit}
            className={`my-2 px-4 py-2 text-center inline-block text-white bg-primary  font-semibold border text-sm md:text-base border-transparent rounded-md w-full trans ${
               !canSubmit && 'cursor-not-allowed opacity-80'
            }`}
         >
            {isLoading ? (
               <div className='gap-2 flex items-center justify-center'>
                  <span className='text-sm animate-pulse'>New Product...</span>
                  <FaSpinner className='animate-spin' />
               </div>
            ) : (
               'Create Product'
            )}
         </button>
      </form>
   );
};

export default NewProduct;
