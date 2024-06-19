import React, { useState } from 'react';
import Image from 'next/image';

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
    // price: number;
}

interface CatalogListProps {
  products: Product[];
}

const CatalogList: React.FC<CatalogListProps> = ({ products }) => {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  // const [images, setImages] = useState([]);

  const handleAddToCart = (productId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: quantity,
    }));
  };

  return (
    <ul className="space-y-4">
      {products.map((product) => (
        <li key={product.id} className="flex flex-col p-4 border roundedshadow-md">
          <div className="flex flex-col items-center">
          <h3 className="mt-4 text-lg font-semibold">{product.title}</h3>
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
            {/* <p className="mt-2">{product.description}</p> */}
            {/* <p className="mt-2 text-xl font-bold">${product.price.toFixed(2)}</p> */}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(product.id, (cart[product.id] || 1) - 1)}
                className="px-2 py-1 text-lg font-bold text-white bg-red-500 rounded"
              >
                -
              </button>
              <input
                type="number"
                value={cart[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                className="w-16 mx-2 text-center border rounded"
              />
              <button
                onClick={() => handleQuantityChange(product.id, (cart[product.id] || 1) + 1)}
                className="px-2 py-1 text-lg font-bold text-white bg-green-500 rounded"
              >
                +
              </button>
            </div>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="px-4 py-2 text-white bg-blue-500 rounded"
            >
              Купить билет
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CatalogList;
