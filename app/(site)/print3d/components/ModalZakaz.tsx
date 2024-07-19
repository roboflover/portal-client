import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import Modal from 'react-modal';
import { Vector2, Vector3 } from 'three';
import * as THREE from 'three';
import ModalMap from './ModalMap';
import CitySelector from './CitySelector';

Modal.setAppElement('#root'); // Это для обеспечения доступности модального окна

export interface ModalZakazRef {
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
}

const initialData: DataProps = {
  dimensions: null,
  volume: 0,
  material: '',
  color: '',
  email: '',
  fileName: '',
  summa: 0,
};

// Используем forwardRef и useImperativeHandle, добавляя типы
const ModalZakaz = forwardRef<ModalZakazRef>((props, ref: Ref<ModalZakazRef>) => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [data, setData] = useState<DataProps>(initialData);
    const [zakaz, setZakaz] = useState(Number)

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

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append('email', data.email);
          formData.append('artikul', Math.ceil(Math.random() * 1000 + 1000).toString());
          formData.append('name', data.fileName);
          if (data.dimensions) {
            formData.append('size', `${(data.dimensions.x * 1000).toFixed()} х ${(data.dimensions.y * 1000).toFixed()} х ${(data.dimensions.z * 1000).toFixed()} (мм)`);
          }
          formData.append('volume', data.volume.toFixed(1));
          formData.append('material', data.material);
          formData.append('color', data.color);
          formData.append('summa', data.summa.toString());
    
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
          className="bg-cyan-900 p-8 shadow-lg w-96 border border-blue-500 rounded-3xl text-gray-300"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
            Ваш заказ № 0001
          </h2>
          {modalIsOpen && data.dimensions && (
            <form onSubmit={handleSubmit}>
              <div>
                  <ul className='my-10' >
                  <li>Наименование: <span className="file-name">{data.fileName}</span></li>
                      <li>Размер: {(data.dimensions.x * 1000).toFixed()} х {(data.dimensions.x * 1000).toFixed()} х {(data.dimensions.x * 1000).toFixed()}(мм)</li>
                      <li>Объем: {data.volume.toFixed(1)} см³</li>
                      <li>Материал: {data.material}</li>
                      {/* <li>Цвет: {color}</li> */}
                      <li>Цвет: {changeColorName(data.color)}</li>
                      <li className='mt-5'>Количество: {data.summa}шт</li>
                      <li className='mt-5 font-semibold'>Сумма заказа: {Number(calculateSummaAndPrice(data.volume, data.summa).toFixed(0)).toLocaleString('ru-RU')}&nbsp;₽</li>
                  </ul>
                <label htmlFor="email">Ваша почта:</label>

                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData({...data, email:e.target.value})}
                  required
                  className="border p-2 rounded w-full"
                />
                <label htmlFor="email">Выберите город:</label>
                <CitySelector />
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
          )}
        </Modal>
    </div>
  );
});

export default ModalZakaz;

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