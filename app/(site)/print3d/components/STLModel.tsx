import { Suspense, useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { STLLoader } from '@/lib/three/examples/jsm/loaders/STLLoader';

// Создаем интерфейс пропсов для компонента для большей читабельности
interface STLModelProps {
  url: string;
  color: string;
  setDimensions: (dimensions: THREE.Vector3) => void;
}

export const STLModel: React.FC<STLModelProps> = ({ url, color, setDimensions }) => {

  const ref = useRef<THREE.Mesh>(null);
  const [loading, setLoading] = useState(false);

  // Логируем процесс загрузки файла
  const geometry = useLoader(STLLoader, url, (loader) => {
    setLoading(true);
    loader.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      // console.log(`Начало загрузки: ${url}. ${itemsLoaded} из ${itemsTotal} загружено.`);
    };

    loader.manager.onLoad = () => {
      // console.log('Все загрузки завершены.');
      setLoading(false);
    };

    loader.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // console.log(`Загрузка: ${url}. ${itemsLoaded} из ${itemsTotal} загружено.`);
    };

    loader.manager.onError = (url) => {
      // console.error(`Ошибка загрузки: ${url}`);
      setLoading(false);
    };
  });

  useEffect(() => {
    if (geometry && ref.current) {
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      if (boundingBox) {
        const dimensions = new THREE.Vector3();
        const initialScale = new THREE.Vector3(1, 1, 1); 
        boundingBox.getSize(dimensions);

        const maxAxis = Math.max(dimensions.x, dimensions.y, dimensions.z);
        const scale = 5 / maxAxis;

        ref.current.scale.setScalar(scale);

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
      {loading && <div>Загрузка модели...</div>}
      <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
};
