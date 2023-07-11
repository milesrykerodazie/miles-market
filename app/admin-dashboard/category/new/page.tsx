import AddCategory from '@/app/components/admin/AddCategory';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Add-Category',
};

const AddCat = () => {
   return <AddCategory />;
};

export default AddCat;
