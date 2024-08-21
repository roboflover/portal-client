// ModalZakaz.tsx
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Modal from 'react-modal';
import * as THREE from 'three';
import RegionSelector, { RegionData } from './RegionSelector';
import { useOrder } from '@/app/context/OrderContext';
import PointSelector from './PointSelector';
import Calculator from './Calculator';
import axios from 'axios';
import PaymentButton from './PaymentButton';
import { OrderPrint3dProps } from '../interface/zakazProps.interface';
import { updateAdress, updateCity } from '../utils/update'
import { changeColorName } from '@/app/(site)/print3d/utils/color'

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host,
});

Modal.setAppElement('#root');

type Model3dDetail = {
  fileName: string;
  volume: number;
  color?: string;
  material: string;
  dimensions: string;
};

export interface ModalZakazRef {
  openModal: () => void;
  closeModal: () => void;
  setData: (newData: Partial<DataProps>) => void;
}

export interface DataProps {
  dimensions: THREE.Vector3 | null;
  volume: number;
  material: string;
  color: string;
  email: string;
  fileName: string;
  summa: number;
  quantity: number;
}

const initialData: DataProps = {
  dimensions: null,
  volume: 0,
  material: '',
  color: '',
  email: '',
  fileName: '',
  summa: 0,
  quantity: 1,
};

const regionStarter = {
  "country_code": "RU",
  "country": "Россия",
  "region": "Санкт-Петербург",
  "region_code": 82,
  "fias_region_guid": "c2deb16a-0330-4f05-821f-1d09c93331e6",
};

interface ModalZakazProps {
  order: OrderPrint3dProps;
  file: File | null;
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>;
}

const ModalZakaz = forwardRef<ModalZakazRef, ModalZakazProps>(({ order, file }, ref) => {

  const [selectedRegion, setSelectedRegion] = useState<RegionData>(regionStarter);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState<DataProps>(initialData);
  const { orderDetails } = useOrder();
  const [currentOrder, setCurrentOrder] = useState<OrderPrint3dProps>(order);
  const [isFormValid, setIsFormValid] = useState(false);
  const hasOpened = React.useRef(false);
  const [deliverySum, setDeliverySum] = useState<number>(0);
  const [newFile, setFile] = useState<File | null>(file);
  
  useEffect(() => {
    if (modalIsOpen) {
      setCurrentOrder(order);  // Обновление состояния при каждом открытии модального окна
    }
  }, [modalIsOpen, order]);

  const checkFormValidity = useCallback(() => {
    // Логика для проверки формы
    const { customerName, customerEmail, customerPhone } = currentOrder;
    if (customerName.trim() !== '' && customerEmail.trim() !== '' && customerPhone.trim() !== '' && selectedAddress.trim() !== '') {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentOrder, selectedAddress]);

  useEffect(() => {
    checkFormValidity();
  }, [currentOrder.customerName, currentOrder.customerEmail, currentOrder.customerPhone, selectedAddress, checkFormValidity]);



  useEffect(() => {
    const totalSum = calculateSummaAndPrice(currentOrder.volume, currentOrder.quantity);
    setCurrentOrder(prevOrder => ({ ...prevOrder, summa: totalSum }));
  }, [currentOrder.volume, currentOrder.quantity]);

  // const checkFormValidity = () => {

  // };

  const getLastOrderNumber = async (): Promise<number> => {
    try {
      const response = await api.get('/order-print3d/orderNumber');
      return response.data;
    } catch (error) {
      console.error('Error fetching last order number:', error);
      throw error;
    }
  };

  function packOrderDetails(model3dDetail: Model3dDetail): string {
    return JSON.stringify(model3dDetail);
  }

  const model3dDetail: Model3dDetail = {
    fileName: currentOrder.fileName,
    volume: currentOrder.volume,
    color: changeColorName(currentOrder.color),
    material: currentOrder.material,
    dimensions: JSON.stringify(1),
  };

  const packedOrderDetails = packOrderDetails(model3dDetail);

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalIsOpen(true);
    },
    closeModal() {
      setModalIsOpen(false);
    },
    setData(newData: Partial<DataProps>) {
      setData((prevData) => ({
        ...prevData,
        ...newData,
      }));
    },
  }));

  const handleRegionSelect = (region: RegionData) => {
    updateCity(selectedRegion.region, setCurrentOrder)
    setSelectedRegion(region);
  };

  const handleAddressSelect = (address: string) => {
    updateAdress(address, setCurrentOrder)
    setSelectedAddress(address);
  };

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Редактирование товара"
        className="bg-cyan-900 shadow-lg border border-blue-500 rounded-3xl text-gray-300 overflow-y-auto"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        {modalIsOpen && (currentOrder.width && currentOrder.length && currentOrder.height) && (
          <form ref={formRef} className="flex flex-col items-center">
            <div>
              <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                Оформление заказа
              </h2>
              <div className="max-w-xs mx-auto my-2 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                  Описание
                </h2>
                <ul className='mb-2'>
                  <li>Размер: {(currentOrder.width)?.toFixed()} х {(currentOrder.length)?.toFixed()} х {(currentOrder.height)?.toFixed()}(мм)</li>
                  <li>Материал: {currentOrder.material}</li>
                  <li>Цвет: {changeColorName(currentOrder.color)}</li>
                  <li>Количество: {currentOrder.quantity}шт</li>
                  <li className='font-semibold relative p-1'>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                    <div className="relative">
                      Сумма заказа: {`${currentOrder.summa.toFixed(0)}₽`}
                    </div>
                  </li>
                </ul>
                <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                  Получатель
                </h2>
                <ul className='mb-2'>
                  <li className="flex flex-initial items-center mb-2">
                    <input
                      type="text"
                      id="fullName"
                      value={currentOrder.customerName}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, customerName: e.target.value })}
                      required
                      className="border p-1 rounded mx-auto w-full"
                      placeholder='ФИО'
                    />
                  </li>
                  <li className="flex flex-initial items-center mb-2">
                    <input
                      type="email"
                      id="email"
                      value={currentOrder.customerEmail}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, customerEmail: e.target.value })}
                      required
                      className="border p-1 rounded mx-auto w-full"
                      placeholder="Ваша почта"
                    />
                  </li>
                  <li className="flex flex-initial items-center mb-2">
                    <input
                      type="text"
                      id="phone"
                      value={currentOrder.customerPhone}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, customerPhone: e.target.value })}
                      required
                      className="border p-1 rounded mx-auto w-full"
                      placeholder='Телефон'
                    />
                  </li>
                  <li className="flex flex-initial items-center mb-2">
                    <input
                      type="comment"
                      id="comment"
                      value={currentOrder.comment}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, comment: e.target.value })}
                      className="border p-1 rounded mx-auto w-full"
                      placeholder="Комментарий"
                    />
                  </li>
                </ul>
                <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                  Доставка
                </h2>
                <ul className='mb-2'>
                  <li><label htmlFor="email">Оператор доставки: CDEK</label></li>
                  <RegionSelector onRegionSelect={handleRegionSelect} />
                  <li><label htmlFor="email">Выберите пункт выдачи:</label></li>
                  <PointSelector selectedRegion={selectedRegion} onAddressSelect={handleAddressSelect} />
                  <li className='font-semibold relative p-1 mt-5'>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                    <Calculator selectedRegion={selectedRegion} onDeliverySumChange={setDeliverySum} />
                  </li>
                </ul>
              </div>
            </div>
            {/* <button type="submit" className="py-2 px-4 bg-blue-500 rounded-xl w-full max-w-xs text-white font-bold transition duration-300 ease-in-out transform active:scale-95 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Оплатить
                </button> */}
            {/* <PaymentButton fullName={currentOrder.customerName} email={currentOrder.customerEmail} phone={currentOrder.customerPhone} value={currentOrder.summa+deliverySum} isFormValid={isFormValid} /> */}
            <PaymentButton  formRef={formRef} currentOrder={currentOrder} value={2} isFormValid={isFormValid} file={file} />
          </form>
        )}
      </Modal>
    </div>
  );
});

ModalZakaz.displayName = 'ModalZakaz';

export default ModalZakaz;

const calculateSummaAndPrice = (volume: number, quantity: number): number => {
  const pricePerCm3 = 12; // Цена за кубический сантиметр
  let newprice = volume * pricePerCm3;
  if (newprice < 45) {
    newprice = 45;
  }
  return newprice * quantity;
};