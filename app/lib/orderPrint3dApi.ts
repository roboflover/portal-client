import axios from 'axios';
import { OrderPrint3dProps } from '@/app/(site)/print3d/interface/zakazProps.interface'

const host = process.env.NEXT_PUBLIC_SERVER
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export const getOrder = async (): Promise<OrderPrint3dProps[]> => {
    try{
        const response = await api.get('/order-print3d');
        return response.data;
    } catch (error) {
        console.error('Error fetching orderPrint3dApi:', error);
        throw error;
    }
};

export const createOrder = async (title: string): Promise<OrderPrint3dProps> => {
  const response = await api.post('/order-print3d', { title });
  return response.data;
};

export const updateOrder = async (id: number, data: OrderPrint3dProps): Promise<OrderPrint3dProps> => {
  const response = await api.patch(`/order-print3d/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/order-print3d/${id}`);
};
