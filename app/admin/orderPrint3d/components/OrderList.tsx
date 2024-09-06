import React, { useEffect, useState } from 'react';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface';

interface OrderListProps {
  orders: OrderPrint3dProps[];
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const host = process.env.NEXT_PUBLIC_SERVER;

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete, isDeleting }) => {
  const [orderPayStatuses, setOrderPayStatuses] = useState<{ [key: number]: string | null }>({});
  const [newStatus, setNewStatus] = useState<{ [key: number]: string }>({}); 
  const [message, setMessage] = useState('');

  const handleStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`${host}/order-print3d/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus: status }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.statusText}`);
      }
  
      setMessage(`Order status updated to ${status}`);
      setNewStatus((prevStatuses) => ({
        ...prevStatuses,
        [orderId]: status,
      }));
  
    } catch (error: any) {
      setMessage(`Failed to update order status: ${error.message}`);
    }
  };

  const handleCheckPayStatus = async (orderId: number, paymentId?: string) => {
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

        setOrderPayStatuses((prevStatuses) => ({
          ...prevStatuses,
          [orderId]: status,
        }));
      } catch (error) {
        console.error('Error fetching payment information:', error);
        setOrderPayStatuses((prevStatuses) => ({
          ...prevStatuses,
          [orderId]: 'Ошибка получения статуса',
        }));
      }
    }
  };
  console.log(orders)
  return (
    <ul className="space-y-2">
      {orders.map((order) => (
        <li key={order.id} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
            <span className="block font-bold text-xl"><h2>{order.customerEmail}</h2></span>
            <span className="block">Дата создания: {order.creationTime}</span>
            <span className="block">Файл: {order.fileName}</span>
            <span className="block">Payment ID: {order.paymentId}</span>
            <span className="block">CDEK UUID: {order.cdekEntityUuid}</span>
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
            <span className="block">Телефон клиента: {order.customerPhone}</span>
            <span className="block">Город доставки: {order.deliveryCity}</span>
            <span className="block">Адрес доставки: {order.deliveryAddress}</span>
            <span className="block">Номер в бд: {order.id}</span>
            <span className="block">Самовывоз: {order.selfPickup.toString()}</span>
            
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
            <span className="block">Статус заказа: { order.orderStatus}</span>
            <span className="block">Изменить статус: 
              <select 
                value={newStatus[order.id] || order.orderStatus}
                onChange={(e) => handleStatus(order.id, e.target.value)}
                className="ml-2 p-1 bg-gray-700 text-white rounded"
              >
                <option value="формируется на складе">формируется на складе</option>
                <option value="запуск 3D печати">запуск 3D печати</option>
                <option value="передаем в доставку">передаем в доставку</option>
                <option value="отправлен">отправлен</option>
              </select>
            </span>
            {orderPayStatuses[order.id] && (
              <span className="block text-green-400">Статус платежа: {orderPayStatuses[order.id]}</span>
            )}
            <button
              onClick={() => handleCheckPayStatus(order.id, order.paymentId)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Проверить статус платежа
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(order.id)}
              className="bg-red-500 text-white p-2 rounded"
              disabled={isDeleting} // Делаем кнопку неактивной, если идёт удаление
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