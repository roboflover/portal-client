'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls  } from '@react-three/drei';
import * as THREE from 'three';
import { STLModel } from './components/STLModel'
import { useRef, useState, useEffect } from 'react';
import ColorPicker from './components/ColorPicker'
import { analyzeModelVolume } from './components/analyzeModelVolume';
const signedVolumeOfTriangle = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): number => {
    return p1.dot(p2.cross(p3)) / 6.0;
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
    const [volume, setVolume] = useState<number>(0);
    const [fileName, setFileName] = useState<string>()
    let zakazParams = {
        modelUrl: setModelUrl,
        color: color,
        material: material,

    }
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setLoading(true);
        if (file) {
            try {            
                const fileSizeInMB = file.size / (1024 * 1024);
                if (fileSizeInMB > 100) {
                    throw new Error('Размер файла превышает 100 МБ');
                }
                setFileName(file.name)
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

    const calculateVolumeAndPrice = (volume:number) => {
        
        const pricePerCm3 = 10; // Цена за кубический сантиметр
       
        let newprice = volume*pricePerCm3;
        if(newprice < 45){
            newprice = 45
        }

        return newprice
    };
    
    const isDimensionExceeds500mm = (dimensions:THREE.Vector3) => {
        return dimensions.x * 1000 > 500 || dimensions.y * 1000 > 500 || dimensions.z * 1000 > 500;
    };
    

    return (
        <div className="flex flex-col items-center justify-center">
          <div className="w-full pt-8 pb-16 space-y-6 rounded shadow-md">
            <h2 className="text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-shadow-default">Расчет 3д печати</h2>

            { dimensions && isDimensionExceeds500mm(dimensions) && (
                <div className=''>
                    <p className="flex flex-wrap space-y-4 items-center justify-center text-red-700">
                        Размеры превышают 500 мм
                    </p>
                </div>
            )}

            { dimensions && !isDimensionExceeds500mm(dimensions) ? (
                
            <div className="space-y-4 items-center justify-center">
                <ul className="flex flex-wrap items-center justify-center space-x-4 space-y-2 list-none p-0">
                <li></li>
                    <li className="w-full sm:w-auto font-medium">{fileName}</li>
                    <li className="w-full sm:w-auto">Ширина: {(dimensions.x * 1000).toFixed()} мм</li>
                    <li className="w-full sm:w-auto">Длина: {(dimensions.y * 1000).toFixed()} мм</li>
                    <li className="w-full sm:w-auto">Высота: {(dimensions.z * 1000).toFixed()} мм</li>
                    <li className="w-full sm:w-auto">Материал: {material}</li>
                    <li className="w-full sm:w-auto">Объем: {volume.toFixed()} см³</li>
                </ul>
                <div className='flex flex-col items-center'>
                    <p className="mt-2 text-xl font-semibold italic border border-blue-500 p-2 rounded-lg" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                    {calculateVolumeAndPrice(volume).toFixed(0)}&nbsp;₽
                    </p>
                </div>
                <ColorPicker setColor={setColor}/>
                <div className="m-10 flex flex-wrap justify-center items-center">
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
                <div className="flex flex-col items-center justify-center">
                    <p className="mb-4 text-center">Загрузить 3д модель в формате .stl, максимальный размер файла 100мб</p>
                    <input type="file" accept=".stl" onChange={handleFileChange} className="mb-4" />
                </div>
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

