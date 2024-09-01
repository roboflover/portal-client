
// admin/orderPrint3d/page.tsx

'use client'
import React, { useEffect, useState } from 'react';
import { getOrder, deleteOrder } from '../../lib/orderPrint3dApi';
import OrderList from './components/OrderList';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface'

const Home: React.FC = () => {
  const [orders, setOrders] = useState<OrderPrint3dProps[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getOrder();
    setOrders(data);
  };

  const handleDeleteTodo = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteOrder(id);
      const order = orders.find((order) => order.id === id);
      if (order) {
        const cdekEntityUuid = order.cdekEntityUuid;
        await fetch('/api/cdek/delete', {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(cdekEntityUuid)
        })
      }
      setMessage('Заказ успешно удален');
      setTimeout(() => {
        setOrders(orders.filter((order) => order.id !== id));
        setMessage(null);
        setIsDeleting(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting order:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      {message && <div className="p-4 mb-4 text-green-500">{message}</div>}
      <OrderList orders={orders} onDelete={handleDeleteTodo} isDeleting={isDeleting} />
    </div>
  );
};

export default Home;