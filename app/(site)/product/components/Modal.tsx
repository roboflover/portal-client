import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuantitySelector from './QuantitySelector'
import RegionSelector, { RegionData } from './RegionSelector';
import PointSelector from './PointSelector';
import Calculator from './Calculator';


interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: { id: number; title: string, price: number } | null;
  children?: React.ReactNode;
}

const regionStarter = {
  "country_code": "RU",
  "country": "Россия",
  "region": "Санкт-Петербург",
  "region_code": 82,
  "fias_region_guid": "c2deb16a-0330-4f05-821f-1d09c93331e6"
}

const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, product, children }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoadingNumOrd, setIsLoadingNumOrd] = useState<boolean>(true);
  const [numOrd, setNumOrd] = useState<number | null>(null);
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [comment, setComment] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(regionStarter)
  const [selectedAddress, setSelectedAddress] = useState<string>()

  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);
    // router.back(); // Закрываем модальное окно и возвращаемся назад
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleRegionSelect = (region: RegionData) => {
    setSelectedRegion(region);
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
          <div className="bg-cyan-900 p-2 shadow-lg border border-blue-500 rounded-3xl text-gray-300">
          {isLoadingNumOrd ? (
                      <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                        Номер заказа 45
                      </h2>
                    ) : (
                      <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                        Заказ №{numOrd}
                      </h2>
                    )}
            <form>
              <div className="max-w-xs mx-auto my-2 px-5 rounded-lg  shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                      Описание
                    </h2>
                    <div className='text-center'>
                    {product && <p className='font-bold'>{product.title}</p>}
                    <div className=" inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded">
                     {product && <p className='font-bold'>Стоимость: {product.price*quantity}{' ₽'}</p>}
                    </div>
                    <QuantitySelector  initialQuantity={1} onQuantityChange={setQuantity}/>
                    </div>
                    <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Получатель
                    </h2>
                    <ul className='mb-2'>
                      <li className="flex flex-initial items-center mb-2">
                        <input
                          type="text"
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value )}
                          required
                          className="border p-1 rounded mx-auto"
                          placeholder='ФИО'
                        />
                      </li>
                      <li className="flex flex-initial items-center mb-2 ">
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value )}
                          required
                          className="border p-1 rounded mx-auto"
                          placeholder="Ваша почта" // Добавляем placeholder
                        />
                      </li>
                      <li className="flex flex-initial items-center mb-2 ">
                        <input
                          type="text"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value )}
                          required
                          className="border p-1 rounded mx-auto"
                          placeholder='Телефон'
                        />
                      </li>
                      <li className="flex flex-initial items-center mb-2 ">
                        <input
                          type="comment"
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value )}
                          required
                          className="border p-1 rounded mx-auto"
                          placeholder="Комментарий" // Добавляем placeholder
                        />
                      </li>
                    </ul>
                    <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Доставка
                    </h2>
                      <ul className='mb-2' >
                        <li><label htmlFor="email">Оператор доставки: CDEK</label></li>
                        <RegionSelector onRegionSelect={handleRegionSelect} />  
                        <li><label htmlFor="email">Выберите пункт выдачи:</label></li>
                        <PointSelector selectedRegion={selectedRegion} onAddressSelect={handleAddressSelect}/>    
                        <li className=' font-semibold relative p-1 mt-5'>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                          <Calculator  selectedRegion={selectedRegion}/>
                        </li>  
                      </ul>
                <button type="submit" className="py-2 px-4 bg-blue-500 rounded-xl w-full max-w-xs text-white font-bold transition duration-300 ease-in-out transform active:scale-95 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Оплатить
                </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
