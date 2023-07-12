import getAdminCats from '@/app/actions/getAdminCats';
import getCategories from '@/app/actions/getCategories';
import getCurrentUser from '@/app/actions/getCurrentUser';
import AddCategory from '@/app/components/admin/AddCategory';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Add-Category',
};

interface CatParams {
   searchParams: {
      keyword: string;
   };
}

const AddCat = async ({searchParams}: CatParams) => {
   const currentUser = await getCurrentUser();
   const categories = await getAdminCats(searchParams, currentUser?.id);
   return (
      //  @ts-expect-error
      <AddCategory categories={categories} />
   );
};

export default AddCat;
