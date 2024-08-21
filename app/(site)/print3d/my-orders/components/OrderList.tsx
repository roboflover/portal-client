'use client';
import React, { useState } from 'react';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface'
import { changeColorName } from '@/app/(site)/print3d/utils/color'

interface OrderListProps {
  orders: OrderPrint3dProps[];
  onDelete: (id: number) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete }) => {
  const [orderStatuses, setOrderStatuses] = useState<{ [key: number]: string | null }>({});

  const handleCheckStatus = async (orderId: number, paymentId?: string) => {

    if (paymentId) {
      try {
        const response = await fetch(`/api/yookassa/getPayment?paymentId=${paymentId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Error fetching status');
        }
        const data = await response.json();
        const { status } = data;
        
        setOrderStatuses((prevStatuses) => ({
          ...prevStatuses,
          [orderId]: status,
        }));
      } catch (error) {
        console.error('Error fetching payment information:', error);
        setOrderStatuses((prevStatuses) => ({
          ...prevStatuses,
          [orderId]: 'Ошибка получения статуса',
        }));
      }
    }
  };

  return (
    <ul className="space-y-2">
      {orders.map((order) => (
        <li key={order.id} className="flex items-center justify-between p-2 rounded border border-gray-300">
          <div className="flex-grow">
            <span className="block font-bold">Файл: {order.fileName}</span>
            <span className="block">Номер заказа: {order.paymentId}</span>
            <span className="block">Количество: {order.quantity}</span>
            <span className="block">Стоимость одной модели: {order.summa} руб.</span>
            <span className="block">Материал: {order.material}</span>
            <span className="block">Ширина: {order.width} мм</span>
            <span className="block">Длина: {order.length} мм</span>
            <span className="block">Высота: {order.height} мм</span>
            <span className="block">Общий объем: {order.volume * order.quantity} cм³</span>
            <span className="block">Цвет: {changeColorName(order.color)}</span>
            {order.comment && (
              <span className="block text-gray-400">Комментарий: {order.comment}</span>
            )}
            {orderStatuses[order.id] && (
              <span className="block text-green-400">Статус: {orderStatuses[order.id]}</span>
            )}
            <button
              onClick={() => handleCheckStatus(order.id, order.paymentId)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Проверить статус заказа
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
