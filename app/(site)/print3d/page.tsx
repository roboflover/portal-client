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
import AddTodo from './components/AddReviewPrint3d';
import { getReviews, updateReview, deleteReview, ReviewPrint3d } from '../../lib/reviewPrint3dApi';
import ReviewPrint3dList from './components/ReviewPrint3dList';


const signedVolumeOfTriangle = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number => {
  return p1.dot(p2.cross(p3)) / 6.0;
};

function Helpers() {
  const gridSize = 100;
  const divisions = gridSize / 10;

  return (
    <>
      {/* <gridHelper args={[gridSize / 10, divisions]} /> */}
      <axesHelper args={[5]} />
    </>
  );
}

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

    handleResize(); // Call the resize handler once to set initial size
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
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const { orderDetails, setDimensions, setVolume, setMaterial, setColor, setSumma, setQuantity, setFileName } = useOrder();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalRef = useRef<ModalZakazRef>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [count, setCount] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [todos, setTodos] = useState<ReviewPrint3d[]>([]);
  const [reviewsPrint3d, setReviewsPrint3d] = useState<ReviewPrint3d[]>([]);

 useEffect(() => {
    const totalSum = calculateSummaAndPrice(orderDetails.volume, count);
    const formattedTotalSum = Number(totalSum.toFixed(0));
    setSumma(formattedTotalSum);
    fetchReviewsPrint3d();
  }, [orderDetails.volume, count, orderDetails.quantity, reviewsPrint3d]);

  const showModal = () => {
    setQuantity(count);

    setModalIsOpen(true);
    if (modalRef.current) {
      modalRef.current.setData({
        dimensions: orderDetails.dimensions,
        volume: orderDetails.volume,
        material: orderDetails.material,
        color: orderDetails.color,
        email: '',
        fileName: orderDetails.fileName,
        summa: orderDetails.summa,
        quantity: count // Передаем count вместо orderDetails.quantity
      });
      modalRef.current.openModal();
    }
  };

  Modal.setAppElement('#root');

  const handleAddToCart = () => {
    setModalIsOpen(true);
  };

  const fetchReviewsPrint3d = async () => {
    const data = await getReviews();
    setReviewsPrint3d(data);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setCount(newQuantity);
      const totalSum = calculateSummaAndPrice(orderDetails.volume, newQuantity);
      const formattedTotalSum = Number(totalSum.toFixed(0));
      setSumma(formattedTotalSum);
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
        if (fileSizeInMB > 50) {
          throw new Error('Размер файла превышает 50 МБ');
        }

        const url = URL.createObjectURL(selectedFile);
        const modelVolume = await analyzeModelVolume(url);
        setVolume(modelVolume);
        setModelUrl(url);
        setFileName(selectedFile.name);
        setFile(selectedFile); 
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

  const handleDelete = async (id: number) => {
    await deleteReview(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleOrderClick = () => {
    // router.push('/order' );
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <div className="w-full pt-8 space-y-6 rounded shadow-md">
        {!orderDetails.dimensions && (
          <p className="flex flex-wrap space-y-4 items-center justify-center text-blue-700">
            Выполнение заказа: 1-5 дней
          </p>
        )}
        <h2 className="text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
          Расчет 3D печати по технологии FMD
        </h2>

        {orderDetails.dimensions && isDimensionExceeds500mm(orderDetails.dimensions) && (
          <div className=''>
            <p className="flex flex-wrap space-y-4 items-center justify-center text-red-700">
              Размеры превышают 500 мм
            </p>
          </div>
        )}

        {orderDetails.dimensions && !isDimensionExceeds500mm(orderDetails.dimensions) ? (
          <div className="">
            <div className='flex justify-center w-full'>
              <ul className="flex flex-wrap justify-center sm:items-center lg:items-center space-x-4 space-y-2 list-none p-0">
                <li></li>
                <li><span className="file-name ">{orderDetails.fileName}</span></li>
                <li className="w-auto">Ширина: {(orderDetails.dimensions.x).toFixed()} мм</li>
                <li className="w-auto">Длина: {(orderDetails.dimensions.y).toFixed()} мм</li>
                <li className="w-auto">Высота: {(orderDetails.dimensions.z).toFixed()} мм</li>
                <li className="w-auto">Материал: {orderDetails.material}</li>
                <li className="w-auto">Объем: {orderDetails.volume.toFixed(1)} см³</li>
              </ul>
            </div>
            <div className='flex items-center justify-center'>
              <input
                type="number"
                value={count}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                min="1"
                className="mt-2 p-2 border border-blue-500 rounded-lg"
                style={{ borderColor: 'rgba(59, 130, 246, 0.5)', width: '78px' }}
              />
              <p className='m-4 pt-2'>х</p>
              <p className="mt-2 text-xl font-semibold italic border border-blue-500 p-2 rounded-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                {orderDetails.summa.toFixed(0)}&nbsp;₽
              </p>
            </div>
            <div className="m-10 flex flex-wrap justify-center items-center">
              <ColorPicker setColor={setColor} />

              <select
                value={orderDetails.material}
                onChange={(e) => { setMaterial(e.target.value) }}
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
              <button onClick={showModal} className="m-5 px-6 py-3 h-10 text-sm font-semibold text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition duration-300 ease-in-out">
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
      <p className="text-gray-500">Если 3D модель не загружается, отправьте на почту <a href="mailto:zakaz@robobug.ru"> zakaz@robobug.ru</a> </p>
      <p className="text-gray-500 underline"><a href="/userAgreement">Перед заказом ознакомьтесь с пользователським соглашением</a> </p>
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
          {modelUrl && <STLModel url={modelUrl} setDimensions={setDimensions} color={orderDetails.color} />}
          <OrbitControls />
          <Helpers />
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
      <h2 className="m-14 text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
        Отзывы
      </h2>
      <AddTodo onReviewPrint3dAdded={fetchReviewsPrint3d} />
      <ReviewPrint3dList reviews={reviewsPrint3d} onDelete={handleDelete} />
        <ModalZakaz ref={modalRef} file={file} />
      </div>
      
      );
      }

  function setErrorMessage(arg0: string) {
      throw new Error('Function not implemented.');
  }
