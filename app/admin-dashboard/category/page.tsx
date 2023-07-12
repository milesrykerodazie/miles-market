import getCategories from '@/app/actions/getCategories';
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
   const categories = await getCategories(searchParams);
   return (
      //  @ts-expect-error
      <AddCategory categories={categories} />
   );
};

export default AddCat;
