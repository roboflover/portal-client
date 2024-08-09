import axios from 'axios';

const host = process.env.NEXT_PUBLIC_SERVER
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export interface Order {
  id: number;
  fileName: string;
  orderDetails?: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  customerPhone: string;
  summa: number;
  quantity: number;
  comment?: string;
  fileSize?: number;
  modelUrl?: string;
}


export const getOrder = async (): Promise<Order[]> => {
    try{
        const response = await api.get('/order-print3d');
        return response.data;
    } catch (error) {
        console.error('Error fetching orderPrint3dApi:', error);
        throw error;
    }
};

export const createOrder = async (title: string): Promise<Order> => {
  const response = await api.post('/order-print3d', { title });
  return response.data;
};

export const updateOrder = async (id: number, data: Order): Promise<Order> => {
  const response = await api.patch(`/order-print3d/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  console.log(id)
  await api.delete(`/order-print3d/${id}`);
};
