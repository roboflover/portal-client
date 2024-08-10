'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as THREE from 'three';
import Cookies from 'js-cookie';

interface OrderDetails {
  dimensions: THREE.Vector3 | null;
  volume: number;
  material: string;
  color: string;
  fileName: string;
  summa: number;
  quantity: number;
  modelUrl: string;
}

type OrderContextType = {
  orderDetails: OrderDetails;
  setDimensions: (newDimensions: THREE.Vector3) => void;
  setMaterial: (newMaterial: string) => void;
  setColor: (newColor: string) => void;
  setSumma: (newSumma: number) => void;
  setVolume: (newVolume: number) => void;
  setQuantity: (newQuantity: number) => void;
  setModelUrl: (newModelUrl: string) => void;
  setFileName: (newFileName: string) => void;
};

// Функция для сохранения деталей заказа в куки
export function saveOrderDetailsInCookies(orderDetails: OrderDetails) {
  Cookies.set('orderDetails', JSON.stringify(orderDetails), { expires: 7 });
}

// Функция для извлечения деталей заказа из кук
function getOrderDetailsFromCookies(): OrderDetails | null {
  const details = Cookies.get('orderDetails');
  return details ? JSON.parse(details) : null;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const Order3dPrintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    dimensions: null,
    volume: 0,
    material: 'ABS',
    color: '#8A8D8F',
    fileName: '',
    summa: 0,
    quantity: 1,
    modelUrl: ''
  });

  useEffect(() => {
    const savedDetails = getOrderDetailsFromCookies();
    if (savedDetails) {
      setOrderDetails(savedDetails);
    }
  }, []);

  const setDimensions = (newDimensions: THREE.Vector3) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, dimensions: newDimensions }));
  };

  const setMaterial = (newMaterial: string) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, material: newMaterial }));
  };

  const setColor = (newColor: string) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, color: newColor }));
  };

  const setSumma = (newSumma: number) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, summa: newSumma }));
  };

  const setVolume = (newVolume: number) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, volume: newVolume }));
  };

  const setQuantity = (newQuantity: number) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, quantity: newQuantity }));
  };

  const setModelUrl = (newModelUrl: string) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, modelUrl: newModelUrl }));
  };

  const setFileName = (newFileName: string) => {
    setOrderDetails(prevDetails => ({ ...prevDetails, fileName: newFileName }));
  };

  useEffect(() => {
    saveOrderDetailsInCookies(orderDetails);
  }, [orderDetails]);

  return (
    <OrderContext.Provider value={{ orderDetails, setDimensions, setMaterial, setColor, setSumma, setVolume, setQuantity, setModelUrl, setFileName }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext) as OrderContextType;