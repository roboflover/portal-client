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
  count: number;
  modelUrl: string;
}

type OrderContextType = {
    orderDetails: OrderDetails;
    setDimensions: (newDimensions: THREE.Vector3) => void;
    setMaterial: (newMaterial: string) => void;
    setColor: (newColor: string) => void;
    setSumma: (newSumma: number) => void;
    setVolume: (newVolume: number) => void;
    setCount: (newCount: number) => void;
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

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    dimensions: null,
    volume: 0,
    material: 'ABS',
    color: '#00B140',
    fileName: '',
    summa: 0,
    count: 1,
    modelUrl: '',
    // email: '',
    // phone: '',
    // name: '',
    // city: '',
    // pickpoint: '',

  });

  const value = { orderDetails, setOrderDetails };
  
  useEffect(() => {
    const savedDetails = getOrderDetailsFromCookies();
    if (savedDetails) {
      setOrderDetails(savedDetails);
    }
  }, []);

  const setDimensions = (newDimensions: THREE.Vector3) => {
    const updatedDetails = { ...orderDetails, dimensions: newDimensions };
    setOrderDetails(updatedDetails);
  };

  const setMaterial = (newMaterial: string) => {
    setOrderDetails(prevDetails => {
    const updatedDetails =  ({ ...prevDetails, material: newMaterial })
    return updatedDetails
    });
  };

  const setColor = (newColor: string) => {
    setOrderDetails(prevDetails => {
    const updatedDetails = ({ ...prevDetails, color: newColor })
    return updatedDetails
    })
  };

  const setSumma = (newSumma: number) => {
    setOrderDetails(prevDetails => {
    const updatedDetails = ({...prevDetails, summa: newSumma })
    return updatedDetails
    })
  }
  
  const setVolume = (newVolume: number) => {
    setOrderDetails(prevDetails => {
    const updatedDetails = ({ ...prevDetails, volume: newVolume })
    return updatedDetails
    })
  }

  const setCount = (newCount: number) => {
    setOrderDetails(prevDetails => {
    const updatedDetails = ({ ...prevDetails, count: newCount })
    return updatedDetails
    })
  }

  const setModelUrl = (newModelUrl: string) => {
    setOrderDetails(prevDetails => {
    const updatedDetails = ({ ...prevDetails, modelUrl: newModelUrl })
    return updatedDetails
    })
  }

  const setFileName = (newFileName: string) => {
    setOrderDetails(prevDetails => {
    const updatedDetails = ({ ...prevDetails, fileName: newFileName })
    return updatedDetails
    })
  }

  return (
    <OrderContext.Provider value={{ orderDetails, setDimensions, setMaterial, setColor, setSumma, setVolume, setCount, setModelUrl, setFileName }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext) as OrderContextType;