import * as THREE from 'three';
import { STLLoader } from '@/lib/three/examples/jsm/loaders/STLLoader';

interface Dimensions {
    x: number;
    y: number;
    z: number;
}

const checkModelDimensions = (geometry: THREE.BufferGeometry): boolean => {
    // Создаем ограничивающий параллелепипед для геометрии
    const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));

    // Вычисляем размеры модели
    const dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    // Проверяем, превышает ли размер модели 1000 метров по любой из осей
    const exceedsLimit = (dimensions.x*1000 > 10000 || dimensions.y*1000 > 10000 || dimensions.z*1000 > 10000)
    console.log('exceedsLimit', exceedsLimit)
    return exceedsLimit;
};

// Функция для уменьшения размера геометрии
const scaleGeometry = (geometry: THREE.BufferGeometry, scale: number): void => {
    geometry.scale(scale, scale, scale);
};

export const analyzeModelVolume = async (url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const loader = new STLLoader();
        loader.load(
            url,
            (geometry: THREE.BufferGeometry) => {
                // Проверка на наличие атрибутов позиции
                if (!geometry.attributes.position) {
                    reject(new Error('Модель не содержит атрибутов позиции'));
                    return;
                }

                // Вызов функции checkModelDimensions
                if (checkModelDimensions(geometry)) {
                    console.log('Размер модели превышает 1000 метров по одной из осей.');
                    scaleGeometry(geometry, 0.001);
                }
 
                const positions = geometry.attributes.position.array;
                let volume = 0;

                // Проходим по всем треугольникам в геометрии
                for (let i = 0; i < positions.length; i += 9) {
                    const p1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    const p2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                    const p3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);

                    // Вычисляем объем тетраэдра, образованного треугольником и началом координат
                    volume += p1.dot(p2.cross(p3)) / 6;
                }

                // Переводим объем из кубических единиц в кубические сантиметры (если единица измерения - метр)
                const volumeInCubicCentimeters = Math.abs(volume) * 1000000;
                console.log(`Объем модели: ${volumeInCubicCentimeters.toFixed(1)} кубических сантиметров`);
                resolve(volumeInCubicCentimeters);
            },
            undefined,
            (error: any) => {
                reject(error);
            }
        );
    });
};


// if (dimensions.x*1000 > 10000 || dimensions.y*1000 > 10000 || dimensions.z*1000 > 10000) {
//     initialScale.x = (dimensions.x)*.001
//     initialScale.y = (dimensions.y)*.001
//     initialScale.z = (dimensions.z)*.001
//    setDimensions(initialScale);
// } else {
//     setDimensions(dimensions);
// }