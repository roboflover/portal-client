// print3d/page.tsx

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { STLModel } from './components/STLModel';
import { useRef, useState, useEffect, ReactNode } from 'react';
import ColorPicker from './components/ColorPicker';
import { analyzeModelVolume } from './components/analyzeModelVolume';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/app/context/OrderContext';
import Cookies from 'js-cookie';
import ModalZakaz, { ModalZakazRef } from './components/ModalZakaz';
import { v4 as uuidv4 } from 'uuid';
import { OrderPrint3dProps } from './interface/zakazProps.interface';
import {
  updateVolume, updateFile, updateFileName, updateModelUrl,
  updateDimensions, updateMaterial, updateSumma, updateQuantity, updateColor
} from './utils/update';

const orderData: OrderPrint3dProps = {
  id: 1,
  orderNumber: 12345,
  quantity: 1,
  summa: 0,
  fileSize: 500,
  fileName: "model.stl",
  material: "PLA",
  width: null,
  length: null,
  height: null,
  volume: 1000,
  color: '#8A8D8F',
  orderDetails: "Some details",
  deliveryCity: "",
  deliveryAddress: "",
  deliveryPoint: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  orderStatus: "Регистрация заказа в системе",
  comment: "",
  modelUrl: undefined,
  paymentId: "abc123",
  cdekEntityUuid: ''
};

const signedVolumeOfTriangle = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number => {
  return p1.dot(p2.cross(p3)) / 6.0;
};

const ResizableCanvas = (props: { children: ReactNode, shadows?: boolean, camera?: any, className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parentNode = canvasRef.current.parentNode as HTMLElement;
        const width = parentNode.offsetWidth;
        const height = parentNode.offsetHeight;

        if (width && height) {
          canvasRef.current.style.width = `${width}px`;
          canvasRef.current.style.height = `${height}px`;
        }
      }
    };

    handleResize(); // Call the resize handler once to set the initial size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="canvas-container">
      <Canvas {...props} />
    </div>
  );
};

export default function Print3dPage() {
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<ModalZakazRef>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [count, setCount] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderPrint3dProps>(orderData);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const totalSum = calculateSummaAndPrice(currentOrder.volume, currentOrder.quantity);
    const formattedTotalSum = Number(totalSum.toFixed(0));
    updateSumma(formattedTotalSum, setCurrentOrder);
    if(totalSum >= 500){
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [currentOrder.volume, currentOrder.quantity ]);

  useEffect(() => {
    Cookies.remove('orderDetails');
  }, []);

  const showModal = () => {
    setCurrentOrder(currentOrder)
    if (modalRef.current && (currentOrder.width && currentOrder.length && currentOrder.height)) {
      modalRef.current.openModal();
    }
  };

  Modal.setAppElement('#root');

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMaterial = e.target.value;
    updateMaterial(newMaterial, setCurrentOrder);
  };

  const handleUpdateDimensions = (newDimensions: THREE.Vector3) => {
    updateDimensions(newDimensions, setCurrentOrder);
  };

  const handleUpdateColor = (newColor: string) => {
    updateColor(newColor, setCurrentOrder);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity > 0) {
      setCount(newQuantity);
      updateQuantity(newQuantity, setCurrentOrder);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setLoading(true);
    if (selectedFile) {
      try {
        if (!selectedFile.name.endsWith('.stl')) {
          throw new Error('Только файлы с расширением .stl допускаются для загрузки');
        }

        const fileSizeInMB = selectedFile.size / (1024 * 1024);
        setFile(selectedFile)
        if (fileSizeInMB > 50) {
          throw new Error('Размер файла превышает 50 МБ');
        }

        const url = URL.createObjectURL(selectedFile);
        let modelVolume = await analyzeModelVolume(url);
        modelVolume = parseInt(modelVolume.toFixed(0), 10);
        updateVolume(modelVolume, setCurrentOrder);
        updateModelUrl(url, setCurrentOrder);
        updateFileName(selectedFile.name, setCurrentOrder);
        updateFile(selectedFile, setCurrentOrder);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Произошла неизвестная ошибка');
        }
        event.target.value = '';
      } finally {
        setLoading(false);
      }
    }
  };

  const isDimensionExceeds500mm = (dimensions: THREE.Vector3) => {
    return dimensions.x > 500 || dimensions.y > 500 || dimensions.z > 500;
  };

  const calculateSummaAndPrice = (volume: number, quantity: number): number => {
    const pricePerCm3 = 12; // Цена за кубический сантиметр

    let newprice = volume * pricePerCm3;
    if (newprice < 45) {
      newprice = 45;
    }

    return newprice * quantity;
  };

  const handleButtonClick = () => {
    Cookies.remove('orderDetails');
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <div className="w-full pt-8 space-y-6 rounded shadow-md">
        {!((currentOrder.width && currentOrder.length && currentOrder.height)) && (
          <div className='flex flex-col items-center justify-center h-full'>
          <button onClick={()=>{window.location.href = '/print3d/my-orders'}} className="text-center px-6 py-3 h-10 text-sm font-semibold text-blue-700 border border-blue-700 rounded hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out">
            Проверить статус заказа
          </button>
          <p className="mt-4 text-blue-700">
            Выполнение заказа: 1-5 дней
          </p>
        </div>
        )}
        <h2 className="text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
          Расчет 3D печати по технологии FMD
        </h2>

        {(currentOrder.width && currentOrder.length && currentOrder.height) && isDimensionExceeds500mm(new THREE.Vector3(currentOrder.width, currentOrder.length, currentOrder.height)) && (
          <div className=''>
            <p className="flex flex-wrap space-y-4 items-center justify-center text-red-700">
              Размеры превышают 500 мм
            </p>
          </div>
        )}
        {!(isValid || !(currentOrder.width && currentOrder.length && currentOrder.height)) && (
            <p className="flex flex-wrap space-y-4 items-center justify-center text-red-700">
            Увеличьте количество до минимального заказа 500(руб.)
          </p>
        )}

        {(currentOrder.width && currentOrder.length && currentOrder.height) && !isDimensionExceeds500mm(new THREE.Vector3(currentOrder.width, currentOrder.length, currentOrder.height)) ? (
          <div className="">
            <div className='flex justify-center w-full'>
            <ul className="flex flex-col md:flex-row justify-center items-center mx-6">
              <li className="w-auto flex items-center mx-2">{currentOrder.fileName}</li>
              <li className="w-auto flex items-center mx-2">Ширина: {(currentOrder.width).toFixed()} мм</li>
              <li className="w-auto flex items-center mx-2">Длина: {(currentOrder.length).toFixed()} мм</li>
              <li className="w-auto flex items-center mx-2">Высота: {(currentOrder.height).toFixed()} мм</li>
              <li className="w-auto flex items-center mx-2">Объем: {currentOrder.volume.toFixed(1)} см³</li>
            </ul>
            </div>
            <div className='flex items-center justify-center'>
              <input
                type="number"
                value={count}
                onChange={handleQuantityChange}
                min="1"
                className="mt-2 p-2 border border-blue-500 rounded-lg"
                style={{ borderColor: 'rgba(59, 130, 246, 0.5)', width: '78px' }}
              />
              <p className='m-4 pt-2'>х</p>
              <p className="mt-2 text-xl font-semibold italic border border-blue-500 p-2 rounded-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                {currentOrder.summa.toFixed(0)}&nbsp;₽ 
              </p>
            </div>
            <div className="m-10 flex flex-wrap justify-center items-center">
              <ColorPicker setColor={handleUpdateColor} />

              <select
                value={currentOrder.material}
                onChange={handleMaterialChange}
                className="m-5 px-3 h-10 text-xs border border-blue-500 rounded"
              >
                <option value="ABS">ABS</option>
                <option value="PETG">PETG</option>
                <option value="PLA">PLA</option>
              </select>
              <button
                onClick={handleButtonClick}
                className="m-5 px-6 py-3 h-10 text-sm font-semibold text-gray-500 border border-gray-500 rounded hover:bg-gray-500 hover:text-white transition duration-300 ease-in-out"
              >
                Перезагрузить
              </button>
              <button
                onClick={showModal}
                className={`m-5 px-6 py-3 h-10 text-sm font-semibold rounded transition duration-300 ease-in-out ${
                  !isValid || loading
                    ? 'text-gray-500 border-gray-500 bg-gray-600 hover:bg-gray-600 cursor-not-allowed'
                    : ' bg-green-500 border-green-500 hover:bg-green-400 hover:text-white text-gray-100'

                }`}
                disabled={!isValid}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-4 text-center">Загрузить 3D модель в формате .stl, максимальный размер файла 50мб</p>
            <input type="file" accept=".stl" onChange={handleFileChange} className="mb-4" />
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        )}
      </div>
      <div className="w-9/12 flex flex-col items-center justify-center flex-grow">
        <p className="text-gray-500">Если 3D модель не загружается, отправьте на почту <a href="mailto:zakaz@robobug.ru">zakaz@robobug.ru</a></p>
        <p className="text-gray-500 underline"><a href="/userAgreement">Перед заказом ознакомьтесь с пользователcским соглашением</a></p>
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] relative flex-grow">
          <ResizableCanvas shadows camera={{ position: [5, 5, 10], fov: 50 }} className="mb-50">
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={400}
            />
            <directionalLight
              position={[-5, -10, 0]}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={400}
            />
            {currentOrder.modelUrl && <STLModel url={currentOrder.modelUrl} setDimensions={handleUpdateDimensions} color={currentOrder.color} />}
            <OrbitControls />
            {/* <Helpers /> */}
          </ResizableCanvas>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="p-8 rounded shadow-lg">
            <p className="text-xl font-semibold">Загрузка...</p>
          </div>
        </div>
      )}
      <ModalZakaz ref={modalRef} file={file} order={currentOrder} setCurrentOrder={setCurrentOrder} />
    </div>
  );
}

function setErrorMessage(arg0: string) {
  throw new Error('Function not implemented.');
}