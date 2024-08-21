export interface PaymentButtonProps {
    formRef: React.RefObject<HTMLFormElement>;
    currentOrder: {
      orderNumber: number;
      quantity: number;
      summa: number;
      fileSize?: number;
      fileName: string;
      material: string;
      volume: number;
      color: string;
      length?: number;
      width?: number;
      height?: number;
      deliveryCity?: string;
      deliveryAddress: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      orderStatus: string;
      comment?: string;
      modelUrl?: string;
      [key: string]: any;
    };
    value: number;
    isFormValid: boolean;
    file?: File;
  }