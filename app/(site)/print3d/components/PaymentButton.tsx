// PaymentButton.tsx

import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';
import { useState } from 'react';
import { OrderPrint3dProps } from '../interface/zakazProps.interface';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface PaymentButtonProps {
  currentOrder: OrderPrint3dProps;
  value: number;
  isFormValid: boolean;
  formRef: React.RefObject<HTMLFormElement>;
  file: File | null;
}

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host,
});

const PaymentButton: React.FC<PaymentButtonProps> = ({ formRef, currentOrder, value, isFormValid, file }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleCreatePayment = async () => {
    if (!isFormValid) return;
    
    const requestData: ICreatePayment = {
      amount: {
        value: value.toString(),
        currency: "RUB",
      },
      payment_method_data: {
        type: "sbp",
      },
      confirmation: {
        type: "redirect",
        return_url: "https://robobug.ru/print3d/my-orders",
      },
      capture: true,
      receipt: {
        customer: {
          full_name: currentOrder.customerName,
          email: currentOrder.customerEmail,
          phone: currentOrder.customerPhone,
        },
        items: [
          {
            description: "3д печать",
            quantity: "1.00",
            amount: {
              value: value.toString(),
              currency: "RUB",
            },
            vat_code: 1,
          },
        ],
      },
    };
  
    setLoading(true);
    setError(null);
  
    try {
      const idempotenceKey = uuidv4();
      // Сначала создаем платеж и получаем checkoutData
      const checkoutResponse = await fetch('/api/yookassa/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
        }),
      });
  
      if (!checkoutResponse.ok) {
        throw new Error('Произошла ошибка при создании платежа.');
      }
  
      const checkoutData = await checkoutResponse.json();
      if (!checkoutData) {
        throw new Error('Произошла ошибка при получении данных платежа.');
      }
  
      const formData = new FormData();
      formData.append('orderNumber', currentOrder.orderNumber.toString());
      formData.append('quantity', currentOrder.quantity.toString());
      formData.append('summa', currentOrder.summa.toString());
      formData.append('fileName', currentOrder.fileName);
      formData.append('material', currentOrder.material);
      formData.append('volume', currentOrder.volume.toString());
      formData.append('color', currentOrder.color);
      formData.append('deliveryCity', currentOrder.deliveryCity ?? "Санкт-Петербург");
      formData.append('deliveryAddress', currentOrder.deliveryAddress);
      formData.append('customerName', currentOrder.customerName);
      formData.append('customerEmail', currentOrder.customerEmail);
      formData.append('customerPhone', currentOrder.customerPhone);
      formData.append('orderStatus', currentOrder.orderStatus);
      formData.append('paymentId', checkoutData.id); // Добавление paymentId
  
      if (currentOrder.width !== null) formData.append('width', currentOrder.width.toString());
      if (currentOrder.length !== null) formData.append('length', currentOrder.length.toString());
      if (currentOrder.height !== null) formData.append('height', currentOrder.height.toString());
      if (currentOrder.comment) formData.append('comment', currentOrder.comment);
      if (currentOrder.modelUrl) formData.append('modelUrl', currentOrder.modelUrl);
      if (file) formData.append('file', file);
  
      // Затем отправляем данные заказа
      const uploadResponse = await fetch(`${host}/order-print3d/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Произошла ошибка при загрузке данных заказа.');
      }
  
      // const uploadData = await uploadResponse.json();
      // if (!uploadData) {
      //   throw new Error('Произошла ошибка при анализе ответа на загрузку данных.');
      // }
  
      // setResponse(uploadData);

      const confUrl = checkoutData.confirmation.confirmation_url;
      window.location.href = confUrl;
  
    } catch (error) {
      console.error(error);
      setError('Произошла ошибка при создании платежа.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='w-full'>
      <button
        onClick={handleCreatePayment}
        disabled={!isFormValid || loading}
        className={`py-2 px-4 rounded-xl w-full max-w-xs text-white font-bold transition duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-4 ${
          !isFormValid || loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300'
        }`}
      >
        {loading ? 'Создается платеж...' : 'Оплатить по СБП'}
      </button>

      {/* {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} */}
    </div>
  );
};

export default PaymentButton;