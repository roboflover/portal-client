// components/CheckoutWidget.tsx
import { useEffect } from 'react';

declare global {
  interface Window {
    YooMoneyCheckoutWidget: any;
  }
}

const CheckoutWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token: 'ct-287e0c37-000f-5000-8000-16961d35b0fd',
        return_url: 'https://robobug.ru/', 
        error_callback: function (error: any) {
          console.log(error);
        },
      });

      checkout.render('payment-form');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <p>
        Ниже отобразится платежная форма. Если вы еще не создавали платеж и не передавали токен для инициализации
        виджета, появится сообщение об ошибке.
      </p>
      <div id="payment-form"></div>
      <p>
        Данные банковской карты для оплаты в <b>тестовом магазине</b>:
        <ul>
          <li>номер — <b>5555 5555 5555 4477</b></li>
          <li>срок действия — <b>01/30</b> (или другая дата, больше текущей)</li>
          <li>CVC — <b>123</b> (или три любые цифры)</li>
          <li>код для прохождения 3-D Secure — <b>123</b> (или три любые цифры)</li>
        </ul>
      </p>
      <p><a href="https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-bank-card">Другие тестовые банковские карты</a></p>
    </div>
  );
};

export default CheckoutWidget;