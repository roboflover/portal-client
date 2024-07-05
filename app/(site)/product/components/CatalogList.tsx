import React, { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';

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
  
  Modal.setAppElement('body'); 

  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleAddToCart = (productId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalIsOpen(true);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {

        // Закрыть модальное окно после отправки
        setModalIsOpen(false);
      } else {

      }
    } catch (error) {
      console.error('Error:', error);
    }
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
              <button onClick={() => handleAddToCart(product.id)} className="px-4 py-2 text-white bg-blue-500 rounded-xl">
                Подробнее
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Редактирование товара"
        className="bg-cyan-900 p-8 shadow-lg w-96 border border-blue-500 rounded-3xl "
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <h2 className="pb-8 text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
          Сделать заказ
        </h2>
        {selectedProduct && (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Ваша почта:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="message">Сообщение:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <button type="submit" className="px-4 py-2  bg-blue-500 rounded-xl mt-4">
              Отправить
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default CatalogList;

















