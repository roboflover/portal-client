'use client'
import React, { useEffect, useState } from 'react';
import { getOrder, updateOrder, deleteOrder, Order } from '../../lib/orderPrint3dApi';
import OrderList from './components/OrderList';

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

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
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      <OrderList orders={orders} onDelete={handleDeleteTodo} />
    </div>
  );
};

export default Home;