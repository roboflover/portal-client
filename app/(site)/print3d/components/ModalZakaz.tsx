import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react';
import Modal from 'react-modal';
import { Vector2, Vector3 } from 'three';
import * as THREE from 'three';
import ModalMap from './ModalMap';
import CitySelector from './CitySelector';
import RegionSelector, { RegionData } from './RegionSelector';
import { useOrder } from '@/app/context/OrderContext';
import PointSelector from './PointSelector';
import Calculator from './Calculator';
import axios from 'axios';

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
  quantity: 1
};

const regionStarter = {
  "country_code": "RU",
  "country": "Россия",
  "region": "Санкт-Петербург",
  "region_code": 82,
  "fias_region_guid": "c2deb16a-0330-4f05-821f-1d09c93331e6"
}

interface ModalZakazProps {
  file: File | null;
}

const ModalZakaz = forwardRef<ModalZakazRef, ModalZakazProps>(({file}, ref: Ref<ModalZakazRef>) => {
    const host = process.env.NEXT_PUBLIC_SERVER

    const [selectedRegion, setSelectedRegion] = useState<RegionData>(regionStarter)
    const [selectedAddress, setSelectedAddress] = useState<string>()
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<DataProps>(initialData);
    const { orderDetails } = useOrder();
    const { dimensions } = orderDetails;
    const { volume } = orderDetails;
    const { material } = orderDetails;
    const { color } = orderDetails;
    const { fileName } = orderDetails;
    const { summa } = orderDetails;
    const { quantity } = orderDetails;
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [comment, setComment] = useState('')
    const [numOrd, setNumOrd] = useState<number | null>(null);
    const [isLoadingNumOrd, setIsLoadingNumOrd] = useState<boolean>(true);

    useEffect(() => {
      const fetchOrderNumber = async () => {
        try {
          const lastOrderNumber = await getLastOrderNumber()
          setNumOrd(lastOrderNumber + 1)
        } catch (error) {
          console.error('Failed to fetch order number:', error);
        } finally {
          setIsLoadingNumOrd(false);
        }
      };

      fetchOrderNumber();
    }, []);


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
        fileName: fileName,
        volume: volume,
        color: changeColorName(color),
        material: material,
        dimensions: JSON.stringify(dimensions)
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
        setSelectedRegion(region);
      };

      const handleAddressSelect = (address: string) => {
        setSelectedAddress(address);
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const orderData = {
            customerName: fullName,
            quantity: Number(quantity),
            customerEmail: email,
            orderNumber: Math.ceil(Math.random() * 1000 + 1000),
            orderDetails,
            summa: Number(summa),
          };
          const lastOrderNumber = await getLastOrderNumber();
          const formData = new FormData()
          if(numOrd){
            formData.append('orderNumber', numOrd.toString())
          }
          formData.append('orderData', JSON.stringify(orderData))
          formData.append('customerName', fullName);
          formData.append('quantity', quantity.toString());
          formData.append('customerEmail', email);
          formData.append('fileName', fileName);
          formData.append('orderDetails', packedOrderDetails);
          formData.append('summa', summa.toString())
          formData.append('customerPhone', phone)
          formData.append('comment', comment)
          
          if(selectedAddress){
            formData.append('deliveryAddress', `${selectedAddress}, ${selectedRegion.region}`)
          } else {
            formData.append('deliveryAddress', `${regionStarter.region}, а улица не выбрана`)
          }
          if (file) {
            formData.append('file', file);  // Добавляем файл в FormData
          }
          await fetch(`${host}/order-print3d/upload`, {
            method: 'POST',
            body: formData,
          });
    
          setModalIsOpen(false);
        } catch (error) {
          console.error('Error:', error);
        }
      }

      const orderNumberString = numOrd !== null && !isNaN(numOrd) ? numOrd.toString() : 'Загрузка...'

        return (
          <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Редактирование товара"
            className="bg-cyan-900 shadow-lg border border-blue-500 rounded-3xl text-gray-300 overflow-y-auto"
            overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            {modalIsOpen && dimensions && (
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div>
                  <div>
                    {isLoadingNumOrd ? (
                      <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                        Загрузка...
                      </h2>
                    ) : (
                      <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                        Оформление заказа  {/*Заказ №{numOrd} */}
                      </h2>
                    )}
                  </div>
                  <div className="max-w-xs mx-auto my-2 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold italic text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
                      Описание
                    </h2>
                  <ul className='mb-2' >                 
                    <li>Размер: {(dimensions.x).toFixed()} х {(dimensions.x).toFixed()} х {(dimensions.x).toFixed()}(мм)</li>
                    <li>Материал: {material}</li> 
                    <li>Цвет: {changeColorName(color)}</li>
                    <li>Количество: {quantity}шт</li>
                    <li className=' font-semibold relative p-1'>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                      <div className="relative">
                        Сумма заказа: {`${summa}₽ `}
                      </div>
                    </li>                
                  </ul>
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
                  </div>
                </div>
                <button type="submit" className="py-2 px-4 bg-blue-500 rounded-xl w-full max-w-xs text-white font-bold transition duration-300 ease-in-out transform active:scale-95 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Оплатить
                </button>
            </form>
          )}
        </Modal>
        {/* <ModalMap/> */}
    </div>
  );
  
});
ModalZakaz.displayName = 'ModalZakaz';

export default ModalZakaz;

function changeColorName(name:string){

  if(name === '#00B140')
    return 'зеленый'

  if(name === '#EF3340')
    return 'красный'
  
  if(name === '#F6921E')
    return 'оранжевый'
  
  if(name === '#0085CA')
    return 'голубой'
  
  if(name === '#5d007f')
    return 'фиолетовый'
  
  if(name === '#D62598')
    return 'розовый'
  
  if(name === '#FFFFFF')
    return 'белый'
  
  if(name === '#8A8D8F')
    return 'серый'
  
  if(name === '#2D2926')
    return 'черный'
}

const calculateSummaAndPrice = (volume: number, summa: number): number => {
  const pricePerCm3 = 12; // Цена за кубический сантиметр

  let newprice = volume * pricePerCm3;
  if (newprice < 45) {
    newprice = 45;
  }

  return newprice * summa;
};