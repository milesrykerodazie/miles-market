import getProducts from '@/app/actions/getProducts';
import Products from '@/app/components/admin/Products';
import Link from 'next/link';
import React from 'react';
import MiniSearch from '../components/admin/MiniSearch';

interface AdminProductProps {
   searchParams: {
      keyword: string;
      category: string;
      ratings: number;
   };
}

const DashboardProducts = async ({searchParams}: AdminProductProps) => {
   //the products
   const products = await getProducts(searchParams);
   return (
      <div className=''>
         <MiniSearch difference='product' />
         {/* @ts-expect-error */}
         <Products products={products} />
      </div>
   );
};

export default DashboardProducts;
