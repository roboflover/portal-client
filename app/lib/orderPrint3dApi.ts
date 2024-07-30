import axios from 'axios';

const host = process.env.NEXT_PUBLIC_SERVER
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export interface OrderPrint3dApi {
  id: number;
  title: string;
  description: string,
  imageUrl: string;
  createdAt: Date;
  images?: File[];
}

interface File {
  id: number;
  url: string;
  exhibitionId?: number;
  projectId?: number;
  productId?: number;
}

export const getOrderPrint3dApi = async (): Promise<OrderPrint3dApi[]> => {
    try{
        const response = await api.get('/orderPrint3dApi');
        return response.data;
    } catch (error) {
        console.error('Error fetching orderPrint3dApi:', error);
        throw error;
    }
};

export const createProduct = async (title: string): Promise<OrderPrint3dApi> => {
  const response = await api.post('/orderPrint3dApi', { title });
  return response.data;
};

export const updateOrderPrint3dApi = async (id: number, data: OrderPrint3dApi): Promise<OrderPrint3dApi> => {
  const response = await api.patch(`/orderPrint3dApi/${id}`, data);
  return response.data;
};

export const deleteOrderPrint3dApi = async (id: number): Promise<void> => {
  await api.delete(`/orderPrint3dApi/${id}`);
};
