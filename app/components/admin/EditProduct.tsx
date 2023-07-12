'use client';

import {SafeProduct} from '@/app/types';
import axios from 'axios';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import React, {FC, useState} from 'react';
import {toast} from 'react-hot-toast';
import {AiFillCloseCircle, AiFillDelete} from 'react-icons/ai';
import {FaSpinner} from 'react-icons/fa';
import {MdOutlineKeyboardArrowDown, MdKeyboardArrowRight} from 'react-icons/md';

interface CatProps {
   id: string;
   categoryName: string;
}
interface ProductsProps {
   productData: SafeProduct;
   catList: CatProps[];
}

interface ProductImage {
   id: string;
   productId: string;
   public_id: string;
   url: string;
   owner_email: string;
}

interface FormData {
   name: string;
   price: string;
   description: string;
   stock: string;
   seller: string;
   productImages: [];
}

const EditProduct: FC<ProductsProps> = ({productData, catList}) => {
   //next route
   const route = useRouter();
   // the states
   const [product, setProduct] = useState({
      name: productData?.name,
      description: productData?.description,
      seller: productData?.seller,
      price: productData?.price.toString(),
      stock: productData?.stock.toString(),
      productImages: [],
   });
   const [productCategory, setProductCategory] = useState<string>(
      productData?.category,
   );

   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [image, setImage] = useState('');
   const [selectedImage, setSelectedImage] = useState('');
   const [deletingImg, setDeletingImg] = useState(false);

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
               // @ts-expect-error
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

   //delete image function
   const deleteImage = async (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
   ) => {
      e.preventDefault();
      setDeletingImg(true);

      if (!selectedImage) {
         return;
      }
      //the deleting starts here
      try {
         const deleteResponse = await axios.delete(
            `/api/product/delete-image/${selectedImage}`,
         );
         if (deleteResponse?.data) {
            if (deleteResponse?.data?.success === true) {
               toast.success(deleteResponse?.data?.message);
            }
            if (deleteResponse?.data?.success === false) {
               toast.error(deleteResponse?.data?.message);
            }
         }
         setImage('');
      } catch (error) {
         console.log(error);

         setImage('');
      } finally {
         setDeletingImg(false);
         route.refresh();
      }
   };

   const canSubmit =
      [...Object.values(product)].every(Boolean) && productCategory;

   //strict number of images
   const numOfImgs =
      productData?.productImages.length + productImages.length > 5;

   const productUpdateData = {
      name,
      description,
      seller,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: productCategory,
      productImages,
   };

   //create product method
   const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (numOfImgs) {
         toast.error('Total product images can not be more than 5.');
         return;
      }

      if (!canSubmit) {
         return;
      }

      try {
         const response = await axios.patch(
            `/api/product/${productData.slug}/edit`,
            productUpdateData,
         );
         if (response?.data) {
            if (response?.data?.success === true) {
               toast.success(response?.data?.message);
            }
            if (response?.data?.success === false) {
               toast.error(response?.data?.message);
            }
         }
         setIsLoading(false);
         route.push('/admin-dashboard');
      } catch (error: any) {
         console.log('error => ', error?.response?.data);
         setIsLoading(false);
      } finally {
         setIsLoading(false);
         route.refresh();
      }
   };
   return (
      <form onSubmit={updateProduct} className='space-y-5'>
         <div className='flex flex-col lg:flex-row gap-2 w-full'>
            {/* add product section */}
            <section className=' bg-white p-3 rounded-lg drop-shadow-md lg:w-[60%] w-full'>
               <h1 className='mb-3 text-lg md:text-3xl font-semibold text-primary'>
                  Edit Product
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
                              {productCategory}
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
                              {catList?.map((category) => (
                                 <p
                                    key={category.id}
                                    onClick={() => {
                                       setProductCategory(
                                          category.categoryName,
                                       );
                                       setOpen((current) => !current);
                                    }}
                                    className='text-sm text-primary cursor-pointer hover:bg-primary hover:text-white trans select-none'
                                 >
                                    <span className='pl-2 '>
                                       {category.categoryName}
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
                           Seller / Brand{' '}
                        </label>
                        <input
                           type='text'
                           className='appearance-none border border-primary bg-white rounded-md py-2 px-3 focus:outline-none w-full text-sm md:text-base text-primary'
                           placeholder='Seller or brand'
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
            <section className='bg-white p-3 rounded-lg drop-shadow-md lg:w-[40%] w-full'>
               <>
                  <h2 className='mb-3 text-sm md:text-2xl font-semibold text-primary'>
                     Upload Product Images
                  </h2>

                  <div className='mb-4 flex flex-col md:flex-row'>
                     <div className='w-full'>
                        <input
                           className='form-control block w-full px-2 py-1.5 font-normal text-primary bg-white bg-clip-padding rounded transition ease-in-out m-0  focus:bg-white focus:outline-none mt-8 text-sm md:text-base shadow-sm shadow-primary'
                           type='file'
                           id='formFile'
                           multiple
                           onChange={handleFileChange}
                        />
                     </div>
                  </div>

                  <div>
                     <span className='text-xs text-primary'>
                        Existing Product Images
                     </span>
                     <div className='grid grid-cols-6 gap-2 mb-2 mt-1'>
                        {productData?.productImages?.map((img) => (
                           <div
                              className='relative'
                              key={img.public_id}
                              onClick={(e) => {
                                 e.preventDefault();
                                 setImage(img?.url), setSelectedImage(img?.id);
                              }}
                           >
                              <Image
                                 src={img.url}
                                 key={img.public_id}
                                 alt='Preview'
                                 className='col-span-1 object-cover shadow rounded border-2 border-gray-200 w-full h-10 bg-white'
                                 width='50'
                                 height='50'
                              />
                           </div>
                        ))}
                     </div>
                  </div>

                  {productImages.length > 0 && (
                     <div className='trans'>
                        <span className='text-xs text-primary pb-1'>
                           Product Images To Update
                        </span>

                        <div className='grid grid-cols-6 gap-2 mb-2 mt-1'>
                           {productImages?.map((img, index) => (
                              <div className='relative' key={index}>
                                 <Image
                                    src={img}
                                    key={index}
                                    alt='Preview'
                                    className='col-span-1 object-cover shadow rounded border border-gray-200 w-full h-10 bg-white'
                                    width='50'
                                    height='50'
                                 />
                                 <AiFillCloseCircle
                                    className='absolute -top-2 text-red-600 w-7 h-7 -right-2 cursor-pointer z-20'
                                    onClick={(e) => {
                                       e.preventDefault();
                                       removeImage(index);
                                    }}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {image ? (
                     <div className='w-full rounded-sm space-y-1'>
                        <Image
                           src={image}
                           alt='Preview'
                           className='w-full h-72 rounded-md object-contain'
                           width='200'
                           height='200'
                        />
                        <div
                           onClick={deleteImage}
                           className='flex items-center justify-center gap-x-2 py-2 bg-primary rounded-md cursor-pointer hover:bg-opacity-80 trans'
                        >
                           <AiFillDelete
                              className={
                                 deletingImg
                                    ? 'text-red-600 animate-pulse'
                                    : 'text-red-600'
                              }
                           />
                           <span className='text-white'>
                              {deletingImg ? (
                                 <FaSpinner className='animate-spin' />
                              ) : (
                                 'Delete'
                              )}
                           </span>
                        </div>
                     </div>
                  ) : (
                     <div className='w-full h-64 rounded-sm'>
                        <Image
                           src='https://upload.wikimedia.org/wikipedia/commons/d/dc/No_Preview_image_2.png'
                           alt='Preview'
                           className=' p-1 h-full w-full bg-white rounded-sm object-contain'
                           width='200'
                           height='200'
                        />
                     </div>
                  )}
               </>
            </section>
         </div>

         <button
            type='submit'
            disabled={!canSubmit}
            className={`my-2 px-4 py-2 text-center inline-block text-white bg-primary  font-semibold border border-transparent rounded-md text-sm md:text-base w-full trans ${
               !canSubmit && 'cursor-not-allowed opacity-80'
            }`}
         >
            {isLoading ? (
               <div className='gap-2 flex items-center justify-center'>
                  <span className='text-sm animate-pulse'>Updating...</span>
                  <FaSpinner className='animate-spin' />
               </div>
            ) : (
               'Update Product'
            )}
         </button>
      </form>
   );
};

export default EditProduct;
