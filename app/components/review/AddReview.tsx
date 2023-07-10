'use client';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {FC, useState} from 'react';
import {toast} from 'react-hot-toast';
import {FaSpinner} from 'react-icons/fa';
import StarRatings from 'react-star-ratings';

interface ReviewProps {
   productId: string;
}

const AddReview: FC<ReviewProps> = ({productId}) => {
   //next route
   const router = useRouter();

   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   //review data
   const reviewData = {
      productId: productId,
      rating: rating,
      comment: comment,
   };

   const canSubmit = productId !== '' && comment !== '';

   const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      if (!canSubmit) {
         toast.error('Check fields.');
         return;
      }

      try {
         const addReview = await axios.post('/api/product/review', reviewData);
         if (addReview?.data) {
            if (addReview?.data?.success === true) {
               toast.success(addReview?.data?.message);
               setRating(0);
               setComment('');
            }

            if (addReview?.data?.success === false) {
               toast.success(addReview?.data?.message);
               setRating(0);
               setComment('');
            }
         }
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false);
         router.refresh();
      }
   };
   return (
      <form onSubmit={submitHandler}>
         <hr className='my-4' />
         <h1 className='text-primary review-title my-3 md:text-2xl font-semibold'>
            Review Product
         </h1>

         <h3 className='text-primary text-sm md:text-base'>Rating</h3>
         <div className='my-2'>
            <div className='ratings'>
               <StarRatings
                  rating={rating}
                  starRatedColor='#4c1d95'
                  numberOfStars={5}
                  name='rating'
                  starDimension='18px'
                  starSpacing='2px'
                  changeRating={(e) => setRating(e)}
               />
            </div>
         </div>
         <div className='my-3'>
            <label className='block mb-1 text-primary text-sm md:text-base'>
               Review{' '}
            </label>
            <textarea
               rows={4}
               className='border border-primary bg-white rounded-md py-2 px-3 outline-none  w-full text-primary text-sm md:text-base'
               placeholder='Your review'
               name='description'
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               required
            ></textarea>
         </div>

         <button
            className='mt-3 mb-5 px-4 py-2 text-center inline-block text-white bg-primary border border-transparent rounded-md hover:bg-primary/60 w-full text-sm md:text-base'
            type='submit'
         >
            {isLoading ? (
               <div className='gap-2 flex items-center justify-center'>
                  <span className='text-sm animate-pulse'>Posting...</span>
                  <FaSpinner className='animate-spin' />
               </div>
            ) : (
               'Post Review'
            )}
         </button>
      </form>
   );
};

export default AddReview;
