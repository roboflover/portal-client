'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { STLModel } from './components/STLModel';
import { useRef, useState, useEffect, ReactNode } from 'react';
import ColorPicker from './components/ColorPicker';
import { analyzeModelVolume } from './components/analyzeModelVolume';
import Modal from 'react-modal';
import ModalMap from './components/ModalMap';
import ModalZakaz, { ModalZakazRef } from './components/ModalZakaz';

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
  const [dimensions, setDimensions] = useState<THREE.Vector3 | null>(null);
  const [color, setColor] = useState('#7FFF00');
  const [material, setMaterial] = useState('ABS');
  const [volume, setVolume] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('-');
  const [summa, setSumma] = useState<number>(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState<string>('@');
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<ModalZakazRef>(null);

  const showModal = () => {
    if (modalRef.current) {
      modalRef.current.setData({
          dimensions: dimensions,
          volume: volume,
          material: material,
          color: color,
          email: 'test@example.com',
          fileName: fileName,
          summa: summa,
      });
      modalRef.current.openModal();
  }
  };

  Modal.setAppElement('#root')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    setLoading(true);
    if (file) {
      try {
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 100) {
          throw new Error('Размер файла превышает 100 МБ');
        }
        setFileName(file.name);
        const url = URL.createObjectURL(file);
        const modelVolume = await analyzeModelVolume(url);
        setVolume(modelVolume);
        setModelUrl(url);
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
    return dimensions.x * 1000 > 500 || dimensions.y * 1000 > 500 || dimensions.z * 1000 > 500;
  };

  const handleMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMaterial(event.target.value);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSumma(Number(event.target.value));
  };

  const calculateSummaAndPrice = (volume: number, summa: number): number => {
    const pricePerCm3 = 12; // Цена за кубический сантиметр

    let newprice = volume * pricePerCm3;
    if (newprice < 45) {
      newprice = 45;
    }

    return newprice * summa;
  };

  const handleAddToCart = () => {
    setModalIsOpen(true);
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

      //setModalIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleButtonClick = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <div className="w-full pt-8 space-y-6 rounded shadow-md">
        {!dimensions && (
          <p className="flex flex-wrap space-y-4 items-center justify-center text-blue-700">
            Выполнение заказа: 1-5 дней
          </p>
        )}
        <h2 className="text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">
          Расчет 3D печати по технологии FMD.
        </h2>

        {dimensions && isDimensionExceeds500mm(dimensions) && (
          <div className=''>
            <p className="flex flex-wrap space-y-4 items-center justify-center text-red-700">
              Размеры превышают 500 мм
            </p>
          </div>
        )}

        {dimensions && !isDimensionExceeds500mm(dimensions) ? (
   <div className="">
        <div className='flex justify-center w-full'>
            <ul className="flex flex-wrap justify-center items-start space-x-4 space-y-2 list-none p-0">
              <li></li>
              <li><span className="file-name ">{fileName}</span></li>
              <li className="w-full sm:w-auto">Ширина: {(dimensions.x * 1000).toFixed()} мм</li>
              <li className="w-full sm:w-auto">Длина: {(dimensions.y * 1000).toFixed()} мм</li>
              <li className="w-full sm:w-auto">Высота: {(dimensions.z * 1000).toFixed()} мм</li>
              <li className="w-full sm:w-auto">Материал: {material}</li>
              <li className="w-full sm:w-auto">Объем: {volume.toFixed(1)} см³</li>
            </ul>
            </div>
            <div className='flex items-center justify-center'>
              <input
                type="number"
                value={summa}
                onChange={handleVolumeChange}
                min="1"
                className="mt-2 mr-2 p-2 border border-blue-500 rounded-lg"
                style={{ borderColor: 'rgba(59, 130, 246, 0.5)', width: '78px' }}
              />

              <p className="mt-2 text-xl font-semibold italic border border-blue-500 p-2 rounded-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                {Number(calculateSummaAndPrice(volume, summa).toFixed(0)).toLocaleString('ru-RU')}&nbsp;₽
              </p>
            </div>
            <div className="m-10 flex flex-wrap justify-center items-center">
              <ColorPicker setColor={setColor} />

              <select
                value={material}
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
              <button onClick={showModal} className="m-5 px-6 py-3 h-10 text-sm font-semibold text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition duration-300 ease-in-out">
                Оформить заказ
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-4 text-center">Загрузить 3D модель в формате .stl, максимальный размер файла 100мб</p>
            <input type="file" accept=".stl" onChange={handleFileChange} className="mb-4" />
          </div>
        )}
      </div>
      <div className="w-9/12 flex flex-col items-center justify-center flex-grow">
      <p className="text-gray-500">Если 3D модель не загружается, отправьте на почту <a href="mailto:zakaz@robobug.ru"> zakaz@robobug.ru</a> </p>
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
          {modelUrl && <STLModel url={modelUrl} setDimensions={setDimensions} color={color} />}
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

  <ModalZakaz ref={modalRef}    />
  <Modal
          isOpen={false}
          contentLabel="Редактирование товара"
          className="bg-cyan-900 p-8 shadow-lg w-96 border border-blue-500 rounded-3xl text-gray-300"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default" >
            Ваш заказ № {Math.ceil(Math.random()*1000+1000)}
          </h2>
          {modalIsOpen && dimensions && (
            <form onSubmit={handleSubmit}>
              <div>
                  <ul className='my-10' >
                  <li>Наименование: <span className="file-name">{fileName}</span></li>
                      <li>Размер: {(dimensions.x * 1000).toFixed()} х {(dimensions.x * 1000).toFixed()} х {(dimensions.x * 1000).toFixed()}(мм)</li>
                      <li>Объем: {volume.toFixed(1)} см³</li>
                      <li>Материал: {material}</li>
                      {/* <li>Цвет: {color}</li> */}
                      <li>Цвет: {changeColorName(color)}</li>
                      <li className='mt-5'>Количество: {summa}шт</li>
                      <li className='mt-5 font-semibold'>Сумма заказа: {Number(calculateSummaAndPrice(volume, summa).toFixed(0)).toLocaleString('ru-RU')}&nbsp;₽</li>
                  </ul>
                <label htmlFor="email">Ваша почта:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                />
              </div>
              <ModalMap/>
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
      }

      const handleButtonClick = () => {
          window.location.reload();
        };
  function setErrorMessage(arg0: string) {
      throw new Error('Function not implemented.');
  }

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
