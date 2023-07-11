import getCategories from '@/app/actions/getCategories';
import getCurrentUser from '@/app/actions/getCurrentUser';
import AddCategory from '@/app/components/admin/AddCategory';
import NewProduct from '@/app/components/admin/NewProduct';
import LinkButton from '@/app/components/buttons/LinkButton';
import {Metadata} from 'next';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Add-Product',
};

const CreateProduct = async () => {
   //get current user
   const currentUser = await getCurrentUser();
   const categories = await getCategories();

   return (
      <>
         {/* @ts-expect-error */}
         <NewProduct currentUser={currentUser} catList={categories} />
      </>
   );
};

export default CreateProduct;
