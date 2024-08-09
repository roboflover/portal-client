import React from 'react';
import { Order } from '../../../lib/orderPrint3dApi';
import Image from 'next/image';

interface OrderListProps {
  orders: Order[];
  onDelete: (id: number) => void;
}

interface Image {
  id: number;
  url: string;
  exhibitionId?: number;
  projectId?: number;
  productId?: number;
}

// interface Product {
//   id: number;
//   title: string;
//   description?: string;
//   images?: Image[];
//     // price: number;
//     createdAt: Date;
// }

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete }) => {
  return (
    <ul className="space-y-2">
      {orders.map((order) => (
        <li key={order.orderNumber} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
            <span className="block font-bold">Файл: {order.fileName}</span>
            {order.orderDetails && (
              <span className="block text-gray-400">Детали заказа: {order.orderDetails}</span>
            )}
            <span className="block">Номер заказа: {order.orderNumber}</span>
            <span className="block">Клиент: {order.customerName}</span>
            <span className="block">Email: {order.customerEmail}</span>
            <span className="block">Адрес доставки: {order.deliveryAddress}</span>
            <span className="block">Телефон клиента: {order.customerPhone}</span>
            <span className="block">Сумма: {order.summa} руб.</span>
            <span className="block">Количество: {order.quantity}</span>
            {order.comment && (
              <span className="block text-gray-400">Комментарий: {order.comment}</span>
            )}
            {order.fileSize !== undefined && (
              <span className="block">Размер файла: {order.fileSize} MB</span>
            )}
            {order.modelUrl && (
              <a href={order.modelUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-500">
                Ссылка на модель
              </a>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(order.id)}
              className="bg-red-500 text-white p-2 rounded"
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
