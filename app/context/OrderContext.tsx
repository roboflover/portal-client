'use client'

import React, { createContext, useContext, useState, ReactNode, useRef, RefObject } from 'react';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface'; 

interface OrderContextType {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  currentOrder: OrderPrint3dProps;
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>;
  modalRef: RefObject<any>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderPrint3dProps>({
    id: 1,
    orderNumber: 12345,
    quantity: 1,
    summa: 0,
    fileSize: 500,
    fileName: "model.stl",
    material: "PETG",
    width: null,
    length: null,
    height: null,
    volume: 0,
    color: '#8A8D8F',
    orderDetails: "Some details",
    deliveryCity: "",
    deliveryAddress: "",
    deliveryPoint: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    orderStatus: "Регистрация заказа в системе",
    comment: "",
    modelUrl: undefined,
    paymentId: "abc123",
    cdekEntityUuid: ''
  });
  const modalRef = useRef<any>(null);

  return (
    <OrderContext.Provider value={{ file, setFile, currentOrder, setCurrentOrder, modalRef }}>
      {children}
    </OrderContext.Provider>
  );
};