// pages/catalog.tsx

'use client'
import { getProducts, updateProduct, deleteProduct, Product } from '@/app/lib/productApi'
import { useEffect, useState } from 'react';
import CatalogList from './components/CatalogList';

export default function Catalog() {
    const [products, setЗroducts] = useState<Product[]>([]);

    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        fetchProducts();
      }, []);

      const [data, setData] = useState<string | null>(null);

      ///
      // useEffect(() => {
      //   const fetchData = async () => {
      //     try {
      //       const response = await fetch('/api/hello/');
      //       if (!response.ok) {
      //         throw new Error(`Error: ${response.status}`);
      //       }
      //       const text = await response.text();
      //       setData(text);
      //     } catch (error) {
      //       console.error('Failed to fetch data:', error);
      //     }
      //   };
    
      //   fetchData();
      // }, []);
      ///


    
      const fetchProducts = async () => {
        const data = await getProducts();
        setЗroducts(data);
      };

    return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl pt-8 pb-16 space-y-6 rounded shadow-md">
            <h2 className="text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">Трасса для гонок дронов</h2>
          </div>
            <CatalogList products={products}  />
        </div>
    )
}
