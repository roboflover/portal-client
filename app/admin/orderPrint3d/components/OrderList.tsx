
// admin/orderPrint3d/components/OrderList.tsx

import React, { useState } from 'react';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface';

interface OrderListProps {
  orders: OrderPrint3dProps[];
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete, isDeleting }) => {
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
        <li key={order.id} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
            <span className="block font-bold">Дата создания: {order.creationTime}</span>
            <span className="block font-bold">Файл: {order.fileName}</span>
            <span className="block">Payment ID: {order.paymentId}</span>
            <span className="block">Количество: {order.quantity}</span>
            <span className="block">Сумма: {order.summa} руб.</span>
            <span className="block">Размер файла: {order.fileSize} MB</span>
            <span className="block">Материал: {order.material}</span>
            <span className="block">Ширина: {order.width} мм</span>
            <span className="block">Длина: {order.length} мм</span>
            <span className="block">Высота: {order.height} мм</span>
            <span className="block">Объем: {order.volume} cм³</span>
            <span className="block">Цвет: {order.color}</span>
            <span className="block">Клиент: {order.customerName}</span>
            <span className="block">Email клиента: {order.customerEmail}</span>
            <span className="block">Телефон клиента: {order.customerPhone}</span>
            <span className="block">Город доставки: {order.deliveryCity}</span>
            <span className="block">Адрес доставки: {order.deliveryAddress}</span>

            {order.orderDetails && (
              <span className="block text-gray-400">Детали заказа: {order.orderDetails}</span>
            )}
            {order.comment && (
              <span className="block text-gray-400">Комментарий: {order.comment}</span>
            )}
            {order.modelUrl && (
              <a href={order.modelUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-500">
                Ссылка на модель
              </a>
            )}
            {orderStatuses[order.id] && (
              <span className="block text-green-400">Статус: {orderStatuses[order.id]}</span>
            )}
            <button
              onClick={() => handleCheckStatus(order.id, order.paymentId)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Проверить статус платежа
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(order.id)}
              className="bg-red-500 text-white p-2 rounded"
              disabled={isDeleting} // Делаем кнопку неактивной, если идет удаление
            >
              Удалить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;