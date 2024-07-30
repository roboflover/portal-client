'use client'

import { Metadata } from 'next';
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import RegionSelector from './components/RegionSelector';
import { useOrder } from '@/app/context/OrderContext';

export interface OrderRef {
  openModal: () => void;
  closeModal: () => void;
  setData: (data: Partial<DataProps>) => void;
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

const Order = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<DataProps>(initialData);
    const { orderDetails } = useOrder();
    const { dimensions } = orderDetails;
    const { volume } = orderDetails;
    const { material } = orderDetails;
    const { color } = orderDetails;
    const { fileName } = orderDetails;
    const { summa } = orderDetails;
    const [email, setEmail] = useState('');

    useEffect(() => {
      console.log(orderDetails)
    })

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
      }
      
    return (
        <div>
          {dimensions ? (
            <>
             <div>
            <form onSubmit={handleSubmit}>
              <div>
              <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                Оформление заказа
                </h2>
              <div className="max-w-md mx-auto  my-10 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
              <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                Описание
                </h2>
                  <ul className='mb-5' >
                    <li>Номер заказа: 0001</li>
                    <li>
                      Файл: {fileName.length > 20 ? `${data.fileName.substring(0, 15)}...` : fileName}
                    </li>                    
                    <li>Размер: {(dimensions.x * 1000).toFixed()} х {(dimensions.x * 1000).toFixed()} х {(dimensions.x * 1000).toFixed()}(мм)</li>
                    <li>Объем: {volume.toFixed(1)} см³</li>
                    <li>Материал: {material}</li>
                    <li>Цвет: {changeColorName(color)}</li>
                    {/* <li>Количество: {count}шт</li> */}
                    <li className=' font-semibold relative p-1'>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
                      <div className="relative">
                        Сумма заказа: {Number(calculateSummaAndPrice(volume, summa).toFixed(0)).toLocaleString('ru-RU')}&nbsp;₽
                      </div>
                    </li>                
                  </ul>
                  </div>
                  
                  <div className="max-w-md mx-auto  my-10 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Получатель
                    </h2>
                      <ul className='mb-5' >
                        <li><label htmlFor="email">Ваша почта:</label>
                        <input
                          type="email"
                          id="email"
                          value={data.email}
                          onChange={(e) => setData({...data, email:e.target.value})}
                          required
                          className="border p-2 rounded w-full"
                        /></li>                
                      </ul>
                  </div>

                  <div className="max-w-md mx-auto  my-10 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Получатель
                    </h2>
                      <ul className='mb-5' >
                        <li><label htmlFor="email">Ваша почта:</label>
                        <input
                          type="email"
                          id="email"
                          value={data.email}
                          onChange={(e) => setData({...data, email:e.target.value})}
                          required
                          className="border p-2 rounded w-full"
                        /></li>                
                      </ul>
                  </div>

                  <div className="max-w-md mx-auto  my-10 px-5 rounded-lg border border-gray-500 shadow-lg overflow-hidden">
                    <h2 className="text-1xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
                      Получатель
                    </h2>
                      <ul className='mb-5' >
                        <li><label htmlFor="email">Ваша почта:</label>
                        <input
                          type="email"
                          id="email"
                          value={data.email}
                          onChange={(e) => setData({...data, email:e.target.value})}
                          required
                          className="border p-2 rounded w-full"
                        /></li>                
                      </ul>
                  </div>

                <label htmlFor="email">Выберите город:</label>
                <RegionSelector />
              </div>
              {/* <ModalMap/> */}
              <div>
                <label htmlFor="message">Комментарий:</label>
                <textarea
                  id="message"
                  // value={message}
                  // onChange={(e) => setMessage(e.target.value)}
                  // required
                  className="border p-2 rounded w-full"
                />
              </div>
              <button type="submit" className="px-4 py-2  bg-blue-500 rounded-xl mt-4">
                Отправить
              </button>
            </form>
    </div> 
         </>        
         ) : (<div>Load...</div>)}

    </div>
)
}

export default Order;

function changeColorName(name:string){
if(name === '#7FFF00')
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