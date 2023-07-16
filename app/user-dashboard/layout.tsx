import {Metadata} from 'next';
import getCurrentUser from '../actions/getCurrentUser';
import UserSidebar from '../components/UserSidebar';
import UserMobileSideBar from '../components/sidebar/UserMobileSidebar';
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
   title: 'User-Dashboard',
};

export default async function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const currentUser = await getCurrentUser();
   if (currentUser?.role !== 'USER') redirect('/');
   return (
      <>
         <section className='py-2 bg-primary dark:bg-white trans rounded-lg'>
            <div className=' mx-auto px-4 flex items-center justify-between'>
               <h1 className='text-bold lg:text-2xl text-white dark:text-primary trans'>
                  User Dashboard
               </h1>
               <UserMobileSideBar password={currentUser?.password} />
            </div>
         </section>{' '}
         <section className='pt-10'>
            <div className='w-full lg:max-w-[90%] mx-auto px-2 lg:px-4'>
               <div className='flex flex-col lg:flex-row'>
                  <UserSidebar password={currentUser?.password} />
                  <main className='w-full lg:w-[90%] lg:px-4'>
                     <article className='bg-white shadow-md shadow-primary rounded-md mb-5 p-1 lg:p-5'>
                        {children}
                     </article>
                  </main>
               </div>
            </div>
         </section>
      </>
   );
}
