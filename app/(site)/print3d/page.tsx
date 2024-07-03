'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls  } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from './../../../lib/three/examples/jsm/loaders/STLLoader';
import { useRef, useState, useEffect } from 'react';
import ColorPicker from './components/ColorPicker'
const signedVolumeOfTriangle = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number => {
    return p1.dot(p2.cross(p3)) / 6.0;
  };

const STLModel: React.FC<{ url: string, color: string, setDimensions: (dimensions: THREE.Vector3) => void }> = ({ url, color, setDimensions }) => {
    const geometry = useLoader(STLLoader, url);
    const ref = useRef<THREE.Mesh>(null);  

    useEffect(() => {
        if (geometry && ref.current) {
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;
            if (boundingBox) {
                const dimensions = new THREE.Vector3();
                boundingBox.getSize(dimensions);
                const initialScale = new THREE.Vector3(1, 1, 1);

                const size = new THREE.Vector3();
                boundingBox.getSize(size);
                // Рассчитываем масштаб модели так, чтобы она занимала весь экран
                const maxAxis = Math.max(size.x, size.y, size.z);
                const scale = 5 / maxAxis;

                ref.current.scale.set(scale, scale, scale);

                // Центрируем модель
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                ref.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

                if (dimensions.x*1000 > 10000 || dimensions.y*1000 > 10000 || dimensions.z*1000 > 10000) {
                    initialScale.x = (dimensions.x)*.001
                    initialScale.y = (dimensions.y)*.001
                    initialScale.z = (dimensions.z)*.001
                   setDimensions(initialScale);
                } else {
                    setDimensions(dimensions);
                }

            }
        }
    }, [geometry, setDimensions]);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.01;
        }
    });
    
    return (
        <>
            <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
                <meshStandardMaterial color={color} />
            </mesh>
        </>
    );
};

function Helpers() {
    // Размер грида в миллиметрах (например, 100 мм)
    const gridSize = 100;
    // Количество делений грида (например, 10 делений для 10 ячеек по 10 мм)
    const divisions = gridSize / 10;

    return (
        <>
            {/* <gridHelper args={[gridSize / 10, divisions]} /> */}
            <axesHelper args={[5]} />
        </>
    );
}

export default function Print3dPage() {
    const [loading, setLoading] = useState(false);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<THREE.Vector3 | null>(null);
    const [color, setColor] = useState('#7FFF00'); // Состояние для цвета
    const [material, setMaterial] = useState('ABS');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setLoading(true);
        if (file) {
            
            try {
                
                const fileSizeInMB = file.size / (1024 * 1024);
                if (fileSizeInMB > 100) {
                    throw new Error('Размер файла превышает 100 МБ');
                }
    
                const url = URL.createObjectURL(file);
                setModelUrl(url);
                console.log('Файл принят:', file);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage('Произошла неизвестная ошибка');
                }
                // Очищаем input, чтобы пользователь мог выбрать другой файл
                event.target.value = '';
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMaterial(event.target.value);
    };

    const calculateVolumeAndPrice = (dimensions: THREE.Vector3) => {
        const volumeCm3 = (dimensions.x * dimensions.y * dimensions.z) * 1e6; // Переводим из м³ в см³
        const pricePerCm3 = 4; // Цена за кубический сантиметр
        let price = volumeCm3 * pricePerCm3;
        
        // Рассчитываем скидку в зависимости от объема
        const maxDiscount = 0.8; // Максимальная скидка 50%
        const baseRate = 1e-6; // Коэффициент для расчета скидки
        const purchaseCount = 50;
        const discountRate = baseRate * Math.log(purchaseCount + 1); 
        let discount = volumeCm3 * discountRate;
        // Ограничиваем скидку максимальным значением
        if (discount > maxDiscount) {
            discount = maxDiscount;
        }
    
        // Применяем скидку к цене
        price = price * (1 - discount);
    
        // Гарантируем, что цена не будет менее 50 рублей
        if (price < 50) {
            price = 50;
        }
    
        return { volumeCm3, price };
    };
    
    
    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-0">
            <div className="w-full max-w-2xl p-8 space-y-6 rounded">
                <h2 className="text-3xl font-bold custom-text text-center">Расчет 3д печати</h2>
                { dimensions ? (
                    <div className="space-y-4">
    <ul className="flex flex-wrap justify-start items-end text-left space-x-4 space-y-2 list-none p-0">
        <li className="w-full sm:w-auto"></li>
        <li className="w-full sm:w-auto">Ширина: {(dimensions.x * 1000).toFixed(2)} мм</li>
        <li className="w-full sm:w-auto">Длина: {(dimensions.y * 1000).toFixed(2)} мм</li>
        <li className="w-full sm:w-auto">Высота: {(dimensions.z * 1000).toFixed(2)} мм</li>
        <li className="w-full sm:w-auto">Материал: {material}</li>
        <li className="w-full sm:w-auto">Объем: {calculateVolumeAndPrice(dimensions).volumeCm3.toFixed(2)} см³</li>
    </ul>
    <p className="text-2xl font-bold">Цена: {calculateVolumeAndPrice(dimensions).price.toFixed(0)} ₽</p>
    <div className="m-10 items-center space-x-4">
        <ColorPicker setColor={setColor}/>
    {/* <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="m-10 font-semibold border border-blue-500 rounded text-lg"
    /> */}
        <select
        value={material}
        onChange={handleMaterialChange}
        className="m-5 px-6 py-3  h-10 text-sm font-semibold border border-blue-500 rounded"
         >
        <option value="ABS">ABS</option>
        <option value="PETG">PETG</option>
        <option value="PLA">PLA</option>
        </select>
          <button
            onClick={handleButtonClick}
            className="m-5 px-6 py-3  h-10 text-sm font-semibold text-gray-500 border border-gray-500 rounded hover:bg-gray-500 hover:text-white transition duration-300 ease-in-out"
          >
            Перезагрузить
          </button>
          <button className="m-5 px-6 py-3  h-10 text-sm font-semibold text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition duration-300 ease-in-out">
            Заказать
        </button>
        </div>
</div>                 
                ):(
                    <>
                    <p>Загрузить 3д модель в формате .stl, максимальный размер файла 100мб</p>
                <input type="file" accept=".stl" onChange={handleFileChange} className="mb-4" />
                </>
                )}

            </div>
            <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] relative">
      <Canvas shadows camera={{ position: [5, 5, 10], fov: 50 }}  className='mb-50' >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={400}
        />
        {modelUrl && <STLModel url={modelUrl} setDimensions={setDimensions} color={color} />}
        <OrbitControls />
        <Helpers />
      </Canvas>
    </div>
    {/* Модальное окно */}
    {loading && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded shadow-lg">
            <p className="text-xl font-semibold">Загрузка...</p>
        </div>
    </div>
)}
    </div>
    );
    }

    const handleButtonClick = () => {
        window.location.reload();
      };
function setErrorMessage(arg0: string) {
    throw new Error('Function not implemented.');
}

