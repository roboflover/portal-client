import { NextPage } from 'next';
import CheckoutWidget from './components/CheckoutWidget';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Прием платежа с помощью виджета ЮKassa</h1>
      <CheckoutWidget />
    </div>
  );
};

export default Home;