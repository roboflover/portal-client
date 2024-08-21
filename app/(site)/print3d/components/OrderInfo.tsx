// components/OrderInfo.tsx
import React, { useEffect, useState } from 'react';

interface PaymentInfo {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  // Добавьте другие поля, которые вам нужны
}

const OrderInfo: React.FC<{ paymentId: string }> = ({ paymentId }) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await fetch(`/api/yookassa/getPayment?paymentId=${paymentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment information');
        }
        const data = await response.json();
        setPaymentInfo(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchPaymentInfo();
  }, [paymentId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!paymentInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Information</h1>
      <p>Payment ID: {paymentInfo.id}</p>
      <p>Status: {paymentInfo.status}</p>
      <p>Amount: {paymentInfo.amount.value} {paymentInfo.amount.currency}</p>
      {/* Отобразите другие нужные поля */}
    </div>
  );
};

export default OrderInfo;
