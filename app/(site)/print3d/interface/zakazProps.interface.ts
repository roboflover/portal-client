export interface OrderPrint3dProps {
      width: number | null;
      length: number | null;
      height: number | null;
      volume: number;
      color: string;
      material: string;
      id: number;
      fileName: string;
      orderDetails?: string;
      orderStatus: string;
      orderNumber: number;
      customerName: string;
      customerEmail: string;
      deliveryCity: string;
      deliveryAddress: string;
      deliveryPoint: string;
      customerPhone: string;
      summa: number;
      quantity: number;
      comment?: string;
      fileSize?: number;
      modelUrl?: string;
      paymentId?: string;
      cdekEntityUuid?: string;
  }