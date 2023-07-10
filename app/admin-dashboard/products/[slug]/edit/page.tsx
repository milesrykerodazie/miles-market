import getCategories from '@/app/actions/getCategories';
import getProductById from '@/app/actions/getProductById';
import EditProduct from '@/app/components/admin/EditProduct';
import {Metadata} from 'next';
import React from 'react';

export const metadata: Metadata = {
   title: 'Admin-Dashboard | Update-Product',
};

interface ProductParams {
   slug: string;
}

const AdminEditProduct = async ({params}: {params: ProductParams}) => {
   //getting the selected product
   const productData = await getProductById(params);
   const categories = await getCategories();
   return (
      <div>
         {/* @ts-expect-error */}
         <EditProduct productData={productData} catList={categories} />
      </div>
   );
};

export default AdminEditProduct;
