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
    
      const fetchProducts = async () => {
        const data = await getProducts();
        setЗroducts(data);
      };

    return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl p-8 space-y-6 rounded shadow-md">
            <h2 className="text-3xl font-bold text-center">Каталог продукции</h2>
          </div>
            <CatalogList products={products}  />
        </div>
    )
}
