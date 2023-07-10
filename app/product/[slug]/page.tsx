import getCanReview from '@/app/actions/getCanReview';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getProductById from '@/app/actions/getProductById';
import ProductDetails from '@/app/components/products/ProductDetails';
import {Metadata} from 'next';
import {BiError} from 'react-icons/bi';

export const metadata: Metadata = {
   title: 'Product',
};

interface ProductParams {
   slug: string;
}

const Product = async ({params}: {params: ProductParams}) => {
   //getting the single product
   const productData = await getProductById(params);

   //current user
   const currentUser = await getCurrentUser();
   //can submit
   const canReview = await getCanReview(params, currentUser?.id);
   return (
      <>
         {productData === null ? (
            <section className='bg-white py-10 rounded-md drop-shadow-md'>
               <div className='lg:max-w-screen-xl mx-auto px-4 flex flex-col justify-center items-center space-y-3'>
                  <BiError className='text-red-600 h-12 w-12 lg:h-20 lg:w-20 animate-pulse' />
                  <h3 className='text-primary md:text-2xl text-center'>
                     Prodict does not exist anymore
                  </h3>
               </div>
            </section>
         ) : (
            <ProductDetails
               //@ts-expect-error
               product={productData}
               //@ts-expect-error
               userId={currentUser?.id}
               //@ts-expect-error
               canReview={canReview}
            />
         )}
      </>
   );
};

export default Product;
