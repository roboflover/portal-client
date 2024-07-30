import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';

interface Image {
  id: number;
  url: string;
  exhibitionId?: number;
  projectId?: number;
  productId?: number;
}
interface Product {
  id: number;
  title: string;
  description?: string;
  images?: Image[];
  price: number;
}
interface CatalogListProps {
  products: Product[];
}

const CatalogList: React.FC<CatalogListProps> = ({ products }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; title: string, price: number } | null>(null)

  const handleAddToCart = (productId: number, productTitle: string, productPrice: number) => {
    setSelectedProduct({ id: productId, title: productTitle, price: productPrice });
    setIsOpen(true);
  };

  return (
    <div>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="flex flex-col p-4 border border-blue-500 rounded-3xl ">
            <div className="flex flex-col items-center">
              <h3 className="mt-4 mb-8 font-bold text-3xl">{product.title}</h3>
              {product.images && product.images.map((image) => (
                <div key={image.id} className="flex flex-col items-center">
                  <Image
                    src={image.url}
                    alt={`Exhibition ${product.title}`}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded"
                    priority={true}
                  />
                </div>
              ))}
              <p className="mt-2 w-full max-w-2xl text-center">{product.description}</p>
              <p className="mt-2 text-xl font-semibold italic border border-blue-500 p-2 rounded-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                {Number(product.price.toFixed(0)).toLocaleString('ru-RU')}&nbsp;₽
              </p>
            </div>
            <div className="flex items-center justify-center mt-4">
              <button onClick={() => handleAddToCart(product.id, product.title, Number(product.price.toFixed(0)))} className="px-4 py-2 text-white bg-blue-500 rounded-xl">
                Оформить заказ
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} product={selectedProduct} />
    </div>
  );
};

export default CatalogList;
