'use client';
const Footer = () => {
   return (
      <div className='px-5 p-4 flex items-center justify-center flex-col w-full'>
         <div className=' text-sm md:text-xs text-primary/70 dark:text-white/70 trans'>
            <p>Copyright © 2023. All rights reserved.</p>
            <p>
               Designed By{' '}
               <span className='font-medium tracking-widest'>
                  <b>Miles Ryker Odazie</b>
               </span>
            </p>
         </div>
      </div>
   );
};

export default Footer;
