'use client';

import {
   CartItem,
   selectCartItems,
} from '@/app/state-management/features/cartSlice';
import {useAppDispatch, useAppSelector} from '@/app/state-management/hooks';
import Link from 'next/link';
import {
   addItemToCart,
   deleteItemFromCart,
   clearCart,
   saveOnCheckout,
} from '../../state-management/features/cartSlice';
import {useRouter} from 'next/navigation';
import {BsFillCartXFill} from 'react-icons/bs';

const Cart = () => {
   //the router
   const router = useRouter();

   //getting the cartItems
   const cartItems = useAppSelector(selectCartItems);

   //dispatch
   const dispatch = useAppDispatch();

   const increaseQty = (cartItem: CartItem) => {
      const newQty = cartItem?.quantity + 1;
      const item = {...cartItem, quantity: newQty};

      if (newQty > Number(cartItem.stock)) return;

      dispatch(addItemToCart(item));
   };

   const decreaseQty = (cartItem: CartItem) => {
      const newQty = cartItem?.quantity - 1;
      const item = {...cartItem, quantity: newQty};

      if (newQty <= 0) return;

      dispatch(addItemToCart(item));
   };

   const amountWithoutTax = cartItems?.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
   );

   const taxAmount = Number(amountWithoutTax * 0.8).toFixed(2);

   const totalAmount = (Number(amountWithoutTax) + Number(taxAmount)).toFixed(
      2,
   );

   const saveCheckOut = {
      amount: amountWithoutTax,
      tax: parseFloat(taxAmount),
      totalAmount: parseFloat(totalAmount),
   };

   return (
      <>
         <section className='py-2 bg-primary dark:bg-white trans rounded-lg'>
            <div className='px-4 flex items-center justify-between'>
               <h2 className='text-bold text-lg lg:text-2xl text-white dark:text-primary trans'>
                  {cartItems?.length || 0} Item(s) in Cart
               </h2>
               <button
                  onClick={() => dispatch(clearCart())}
                  className='text-primary text-xs md:text-sm bg-white p-1 md:p-2 rounded-md font-bold dark:bg-primary/80 dark:text-white trans hover:text-primary'
               >
                  Clear Cart
               </button>
            </div>
         </section>

         {cartItems?.length > 0 ? (
            <section className='py-10'>
               <div className='w-full lg:max-w-screen-xl mx-auto lg:px-4'>
                  <div className='flex flex-col lg:flex-row gap-4'>
                     <main className='w-full lg:w-3/4'>
                        <article className='border border-gray-200 bg-white shadow-sm rounded mb-5 p-2 lg:p-5 h-[700px] overflow-y-auto'>
                           {cartItems?.map((cartItem) => (
                              <div key={cartItem?.slug}>
                                 <div className='flex flex-wrap lg:flex-row gap-5 mb-4'>
                                    <div className='w-full lg:w-2/5 xl:w-2/4'>
                                       <div className='flex leading-5'>
                                          <div>
                                             <div className='block w-16 h-16 rounded border border-gray-200 overflow-hidden'>
                                                <img
                                                   src={cartItem?.productImage}
                                                   alt={cartItem.name}
                                                   className='w-full h-full'
                                                />
                                             </div>
                                          </div>
                                          <div className='ml-3 flex flex-col text-sm md:text-base'>
                                             <Link
                                                href={`/product/${cartItem?.slug}`}
                                                className='hover:text-primary text-primary/90 trans font-medium'
                                             >
                                                {cartItem.name}
                                             </Link>
                                             <span className='mt-1 hover:text-primary text-primary/90 trans font-light'>
                                                {' '}
                                                Seller: {cartItem.seller}
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className='w-24 h-10 rounded-md '>
                                       <div className='flex flex-row w-full rounded-lg relative bg-white mt-1 '>
                                          <button
                                             data-action='decrement'
                                             className=' bg-primary/90 text-white hover:bg-primary h-full w-20 rounded-l cursor-pointer outline-none'
                                             onClick={() =>
                                                decreaseQty(cartItem)
                                             }
                                          >
                                             <span className='m-auto md:text-2xl font-medium'>
                                                −
                                             </span>
                                          </button>
                                          <input
                                             type='number'
                                             className='focus:outline-none text-center w-full bg-white font-semibold text-sm md:text-base cursor-default flex items-center text-primary  outline-none custom-input-number'
                                             name='custom-input-number'
                                             value={cartItem.quantity}
                                             readOnly
                                          ></input>
                                          <button
                                             data-action='increment'
                                             className='bg-primary/90 text-white hover:bg-primary h-full w-20 rounded-r cursor-pointer outline-none'
                                             onClick={() =>
                                                increaseQty(cartItem)
                                             }
                                          >
                                             <span className='m-auto md:text-2xl font-medium'>
                                                +
                                             </span>
                                          </button>
                                       </div>
                                    </div>
                                    <div>
                                       <div className='leading-5'>
                                          <p className='font-semibold text-primary text-sm md:text-base'>
                                             $
                                             {(
                                                cartItem.price *
                                                cartItem.quantity
                                             ).toFixed(2)}
                                          </p>
                                          <small className='text-gray-400 text-xs md:text-sm'>
                                             {' '}
                                             ${cartItem.price} / per item{' '}
                                          </small>
                                       </div>
                                    </div>
                                    <div className='flex-auto'>
                                       <div className='float-right'>
                                          <a
                                             className='px-4 py-2 inline-block text-red-600 text-sm md:text-base bg-white drop-shadow-md rounded-md  cursor-pointer'
                                             onClick={() =>
                                                dispatch(
                                                   deleteItemFromCart(
                                                      cartItem?.productId,
                                                   ),
                                                )
                                             }
                                          >
                                             Remove
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                                 <hr className='my-4 border border-primary/20' />
                              </div>
                           ))}
                        </article>
                     </main>
                     <aside className='w-full lg:w-1/4'>
                        <article className='border border-gray-200 bg-white shadow-sm rounded mb-5 p-2 lg:p-5'>
                           <ul className='mb-5'>
                              <li className='flex justify-between mb-1'>
                                 <span className='text-primary font-semibold text-sm md:text-base'>
                                    Amount before Tax:
                                 </span>
                                 <span className='text-primary text-sm md:text-base'>
                                    ${amountWithoutTax}
                                 </span>
                              </li>
                              <li className='flex justify-between mb-1'>
                                 <span className='text-primary font-semibold text-sm md:text-base'>
                                    Total Units:
                                 </span>
                                 <span className='text-primary font-light text-sm md:text-base'>
                                    {cartItems?.reduce(
                                       (acc, item) => acc + item.quantity,
                                       0,
                                    )}{' '}
                                    (Units)
                                 </span>
                              </li>
                              <li className='flex justify-between mb-1'>
                                 <span className='text-primary font-semibold text-sm md:text-base'>
                                    TAX:
                                 </span>
                                 <span className='text-primary font-light text-sm md:text-base'>
                                    ${taxAmount}
                                 </span>
                              </li>
                              <li className='md:text-lg font-bold border-t flex justify-between mt-3 pt-3 text-primary'>
                                 <span>Total price:</span>
                                 <span>${totalAmount}</span>
                              </li>
                           </ul>

                           <button
                              className='px-4 py-3 mb-2 inline-block md:text-lg w-full text-center font-medium text-white bg-primary/90 border rounded-md hover:bg-primary trans cursor-pointer text-sm'
                              onClick={() => {
                                 dispatch(saveOnCheckout(saveCheckOut));
                                 router.push('/shipping');
                              }}
                           >
                              Continue
                           </button>

                           <Link
                              href='/'
                              className='px-4 py-3 inline-block text-sm md:text-lg w-full text-center font-medium text-primary hover:text-white bg-white shadow-sm border border-primary/20 rounded-md hover:bg-primary trans'
                           >
                              Back to shop
                           </Link>
                        </article>
                     </aside>
                  </div>
               </div>
            </section>
         ) : (
            <section className='py-10'>
               <div className='w-full lg:max-w-screen-xl mx-auto p-4 lg:p-6 rounded-md bg-white'>
                  <div className='flex flex-col items-center justify-center space-y-5'>
                     <BsFillCartXFill className='h-10 w-10 md:h-20 md:w-20 text-primary animate-pulse trans' />
                     <h2 className='md:text-2xl font-semibold text-primary'>
                        Your cart is empty!
                     </h2>
                     <p className='text-primary leading-relaxed text-sm md:text-base text-center'>
                        Checkout Our Amazing Products And Place An Order.
                     </p>
                     <Link
                        href='/'
                        className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded inline-block text-sm md:text-base'
                     >
                        Start Shopping
                     </Link>
                  </div>
               </div>
            </section>
         )}
      </>
   );
};

export default Cart;
