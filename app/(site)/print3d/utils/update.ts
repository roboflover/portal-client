import { OrderPrint3dProps } from "../interface/zakazProps.interface";
import * as THREE from 'three';

export const updateRegion = (newRegion: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
        ...prevOrder,
        region: newRegion
    }));
};

export const updateVolume = (newVolume: number, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
        ...prevOrder,
        volume: newVolume
    }));
};

export const updateModelUrl = (newUrl: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      modelUrl: newUrl
    }));
};
  
export const updateFileName = (newFileName: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      fileName: newFileName
    }));
};
  
export const updateFile = (newFile: File, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      file: newFile
    }));
};

export const updateDimensions = (
    newDimensions: THREE.Vector3,
    setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>
  ) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      width: newDimensions.x,
      length: newDimensions.y,
      height: newDimensions.z
    }));
  };

// export const updateMaterial = (newMaterial: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
//     setCurrentOrder(prevOrder => ({
//         ...prevOrder,
//         material: newMaterial
//     }));
// };

export const updateMaterial = (
    newMaterial: string,
    setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>
  ) => {
    setCurrentOrder((prevOrder) => ({
      ...prevOrder,
      material: newMaterial,
    }));
  };

export const updateColor = (newColor: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      color: newColor
    }));
};
  
export const updateSumma = (newSumma: number, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      summa: newSumma
    }));
};
  
export const updateQuantity = (newQuantity: number, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
    setCurrentOrder(prevOrder => ({
      ...prevOrder,
      quantity: newQuantity
    }));
};
  
export const updateAdress= (newAdress: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
  setCurrentOrder(prevOrder => ({
    ...prevOrder,
    deliveryAddress: newAdress
  }));
};

export const updateCity= (newCity: string, setCurrentOrder: React.Dispatch<React.SetStateAction<OrderPrint3dProps>>) => {
  setCurrentOrder(prevOrder => ({
    ...prevOrder,
    deliveryCity: newCity
  }));
};




