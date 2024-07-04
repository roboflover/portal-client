import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
import { STLLoader } from '@/lib/three/examples/jsm/loaders/STLLoader';

export const STLModel: React.FC<{ url: string, color: string, setDimensions: (dimensions: THREE.Vector3) => void }> = ({ url, color, setDimensions }) => {
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