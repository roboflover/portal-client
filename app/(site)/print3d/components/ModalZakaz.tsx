import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react';
import Modal from 'react-modal';
import { Vector2, Vector3 } from 'three';
import * as THREE from 'three';
import ModalMap from './ModalMap';
import CitySelector from './CitySelector';
import RegionSelector from './RegionSelector';
import { useOrder } from '@/app/context/OrderContext';
import PointSelector from './PointSelector';
import { RegionData } from './RegionSelector'
import Calculator from './Calculator';

Modal.setAppElement('#root');

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
    count: number;
}

const initialData: DataProps = {
  dimensions: null,
  volume: 0,
  material: '',
  color: '',
  email: '',
  fileName: '',
  summa: 0,
  count: 1
};

const regionStarter = {
  "country_code": "RU",
  "country": "Россия",
  "region": "Санкт-Петербург",
  "region_code": 82,
  "fias_region_guid": "c2deb16a-0330-4f05-821f-1d09c93331e6"
}

const ModalZakaz = forwardRef<ModalZakazRef>((props, ref: Ref<ModalZakazRef>) => {
    const [selectedRegion, setSelectedRegion] = useState<RegionData>(regionStarter)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<DataProps>(initialData);
    const { orderDetails } = useOrder();
    const { dimensions } = orderDetails;
    const { volume } = orderDetails;
    const { material } = orderDetails;
    const { color } = orderDetails;
    const { fileName } = orderDetails;
    const { summa } = orderDetails;
    const { count } = orderDetails;
    const [email, setEmail] = useState('');

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
        console.log(selectedRegion)
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append('email', email);
          formData.append('artikul', Math.ceil(Math.random() * 1000 + 1000).toString());
          formData.append('name', fileName);
          if (dimensions) {
            formData.append('size', `${(dimensions.x * 1000).toFixed()} х ${(dimensions.y * 1000).toFixed()} х ${(dimensions.z * 1000).toFixed()} (мм)`);
          }
          formData.append('volume', volume.toFixed(1));
          formData.append('material', material);
          formData.append('color', color);
          formData.append('summa', summa.toString());
    
          await fetch('/your-api-endpoint', {
            method: 'POST',
            body: formData,
          });
    
          setModalIsOpen(false);
        } catch (error) {
          console.error('Error:', error);
        }
      };

        return (
          <div>
          <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
              contentLabel="Редактирование товара"
              className="bg-cyan-900 p-8 shadow-lg w-96 border border-blue-500 rounded-3xl text-gray-300 overflow-y-auto"
              overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >

          {modalIsOpen && dimensions && (
            <form onSubmit={handleSubmit}>
              <div>
              <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                Оформление заказа
                </h2>
              <div className="max-w-md mx-auto  my-5 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
              <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                Описание
                </h2>
                  <ul className='mb-5' >                 
                    <li>Размер: {(dimensions.x * 1000).toFixed()} х {(dimensions.x * 1000).toFixed()} х {(dimensions.x * 1000).toFixed()}(мм)</li>
                    <li>Материал: {material}</li>
                    <li>Цвет: {changeColorName(color)}</li>
                    <li>Количество: {count}шт</li>
                    <li className=' font-semibold relative p-1'>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                      <div className="relative">
                        Сумма заказа: {`${summa}₽ `}
                      </div>
                    </li>                
                  </ul>
                  </div>
                  
                  <div className="my-5 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Получатель
                    </h2>
                    <ul className='mb-5 '>
                      <li className="flex flex-initial items-center mb-2 ">
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value )}
                          required
                          className="border p-1 rounded mx-auto w-full"
                          placeholder="Ваша почта" // Добавляем placeholder
                        />
                      </li>
                      <li className="flex flex-initial items-center mb-2 ">
                        <input
                          type="text"
                          id="phone"
                          // value={data.phone}
                          // onChange={(e) => setData({ ...data, phone: e.target.value })}
                          required
                          className="border p-1 rounded mx-auto w-full"
                          placeholder='Телефон'
                        />
                      </li>
                      <li className="flex flex-initial items-center mb-2">
                        <input
                          type="text"
                          id="fullName"
                          // value={data.fullName}
                          // onChange={(e) => setData({ ...data, fullName: e.target.value })}
                          required
                          className="border p-1 rounded mx-auto w-full"
                          placeholder='ФИО'
                        />
                      </li>
                    </ul>
                  </div>

                  <div className="max-w-md mx-auto  my-5 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Доставка
                    </h2>
                      <ul className='mb-5' >
                        <li><label htmlFor="email">Страна: Россия</label></li>
                        <li><label htmlFor="email">Оператор доставки: CDEK</label></li>
                        <li><label htmlFor="email">Выберите город:</label></li>
                        <RegionSelector onRegionSelect={handleRegionSelect} />  
                        <li><label htmlFor="email">Выберите пункт выдачи:</label></li>
                        <PointSelector selectedRegion={selectedRegion}/>    
                        <li className=' font-semibold relative p-1 mt-5'>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                        <Calculator  selectedRegion={selectedRegion}/>
                    </li>  
                      </ul>
                  </div>
                </div>
              <button type="submit" className="px-4 py-2  bg-blue-500 rounded-xl mt-4">
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
    return 'сервый'
  
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