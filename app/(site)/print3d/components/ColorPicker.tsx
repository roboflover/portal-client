// ColorPicker.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const pantoneColors = [
    { name: 'Красный', hex: '#EF3340' },
    { name: 'Оранжевый', hex: '#F6921E' },
    { name: 'Желтый', hex: '#FEDD00' },
    { name: 'Зеленый', hex: '#00B140' },
    { name: 'Синий', hex: '#0085CA' },
    { name: 'Фиолетовый', hex: '#5d007f' },
    { name: 'Розовый', hex: '#D62598' },
    { name: 'Белый', hex: '#FFFFFF' },
    { name: 'Серый', hex: '#8A8D8F' },
    { name: 'Черный', hex: '#2D2926' },
];

interface ColorPickerProps {
    setColor: (color: string) => void;
}

function hexToVector3(hex: string): THREE.Vector3 {
    // Создаем объект THREE.Color из HEX строки
    const color = new THREE.Color(hex);

    // Преобразуем цвет в THREE.Vector3
    const vector = new THREE.Vector3(color.r, color.g, color.b);

    return vector;
}

export default function ColorPicker({ setColor }: ColorPickerProps) {
    const [localColor, setLocalColor] = useState('#EF3340');
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    const selectedColor = pantoneColors.find(c => c.hex === localColor);

    const handleClickOutside = (event:MouseEvent) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleColorChange = (colorHex:string) => {
        setLocalColor(colorHex);
        setColor(colorHex);
        setIsOpen(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="m-6 relative flex justify-center items-center" ref={pickerRef}>
            <div
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                style={{ backgroundColor: localColor }}
                onClick={() => setIsOpen(!isOpen)}
            ></div>
            {isOpen && (
                <ul className="absolute mt-2 p-4 border border-gray-300 rounded bg-white overflow-auto z-10 grid grid-cols-3 gap-4 square-palette">
                    {pantoneColors.map((colorOption) => (
                        <li
                            key={colorOption.hex}
                            className="flex items-center justify-center cursor-pointer hover:bg-gray-100 square-item"
                            onClick={() => handleColorChange(colorOption.hex)}
                        >
                            <div
                                className="w-full h-full border border-gray-600"
                                style={{ backgroundColor: colorOption.hex }}
                            ></div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}