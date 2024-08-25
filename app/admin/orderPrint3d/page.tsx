'use client'
import React, { useEffect, useState } from 'react';
import { getOrder, updateOrder, deleteOrder } from '../../lib/orderPrint3dApi';
import OrderList from './components/OrderList';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface' 

const Home: React.FC = () => {
  const [orders, setOrders] = useState<OrderPrint3dProps[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getOrder();
    setOrders(data);
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteOrder(id);
    setOrders(orders.filter((order) => order.id !== id));
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
    } else {
      console.error('Order not found');
    }


  };  

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      <OrderList orders={orders} onDelete={handleDeleteTodo} />
    </div>
  );
};

export default Home;
