// pages/exhibitions.tsx

'use client'
import { getProducts, updateProduct, deleteProduct, Product } from '../../lib/exhibitionsApi';
import { useEffect, useState } from 'react';
import ExhibitionsList from './components/ExhibitionsList';

export default function Exhibitions() {
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
        <div>
            <h2 className="text-3xl font-bold text-center">Предстоящие Выставки</h2>
            <ExhibitionsList products={products}  />
        </div>
    )
}
