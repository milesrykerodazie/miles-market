import {Comment} from '@/app/types';
import {format} from 'date-fns';
import React, {FC} from 'react';
import {AiFillDelete} from 'react-icons/ai';
import StarRatings from 'react-star-ratings';

interface ReviewProps {
   reviews: Comment[];
   userId: string;
}

const Reviews: FC<ReviewProps> = ({reviews, userId}) => {
   return (
      <div className='h-[600px] md:h-[400px] overflow-y-auto pt-2'>
         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
            {reviews?.map((review) => (
               <article
                  key={review.id}
                  className='block p-3 bg-white md:max-w-sm rounded-lg border drop-shadow-md mb-5'
               >
                  <div className='flex justify-between'>
                     <div className='flex items-center mb-4 space-x-4'>
                        <img
                           className='w-6 h-6 md:w-10 md:h-10 rounded-full'
                           src={
                              review?.owner?.image
                                 ? review?.owner?.image
                                 : '/images/no-user.jpg'
                           }
                           alt='user'
                        />
                        <div className='space-y-1 font-medium text-primary text-sm md:text-base'>
                           <p>
                              {review?.owner?.name}
                              <time className='block text-xs md:text-sm font-light text-primary'>
                                 Posted on:{' '}
                                 {format(review?.createdAt, 'MMM-dd-yyy')}
                              </time>
                           </p>
                        </div>
                     </div>
                     {userId === review?.userId && (
                        <AiFillDelete className='text-red-600 md:w-5 md:h-5 w-4 h-4' />
                     )}
                  </div>

                  <div className='flex flex-wrap items-center space-x-2 mb-2'>
                     <div className='ratings'>
                        <StarRatings
                           rating={review?.rating}
                           starRatedColor='#4c1d95'
                           numberOfStars={5}
                           starDimension='15px'
                           starSpacing='1px'
                           name='rating'
                        />
                     </div>
                     <span className='text-primary text-sm md:text-base'>
                        {review?.rating}
                     </span>
                  </div>

                  <p className='mb-2 font-light text-primary text-sm'>
                     {review?.comment}
                  </p>
               </article>
            ))}
         </div>
      </div>
   );
};

export default Reviews;
