'use client';

import OrderInfo from "../print3d/components/OrderInfo";

const OrderCompleted = () => {

  const paymentId = '2e52ea73-000f-5000-9000-177acbb60f7c';

  return (
    <div >
        <h2>Ваш заказ оформлен!</h2>
        <OrderInfo paymentId={paymentId} />
    </div>
  );
};
 
export default OrderCompleted;