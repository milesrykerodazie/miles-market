import getCategories from './actions/getCategories';
import getProducts from './actions/getProducts';
import ProductList from './components/products/ProductList';

interface HomeProps {
   searchParams: {
      keyword: string;
      category: string;
      ratings: number;
   };
}

export default async function Home({searchParams}: HomeProps) {
   //the products
   const products = await getProducts(searchParams);

   const categories = await getCategories();

   return (
      // @ts-expect-error
      <ProductList products={products} categories={categories} />
   );
}
