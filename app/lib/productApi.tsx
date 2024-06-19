import axios from 'axios';
import { constrainedMemory } from 'process';

const host = process.env.NEXT_PUBLIC_SERVER
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export interface Product {
  id: number;
  title: string;
  description: string,
  imageUrl: string;
  createdAt: Date;
  images?: Image[];
  price: number;
}


interface Image {
  id: number;
  url: string;
  catalogId?: number;
  projectId?: number;
  productId?: number;
}

export const getProducts = async (): Promise<Product[]> => {
    try{
        const response = await api.get('/product');
        return response.data;
    } catch (error) {
        console.error('Error fetching catalog:', error);
        throw error;
    }
};

export const createProduct = async (title: string): Promise<Product> => {
  const response = await api.post('/product', { title });
  return response.data;
};

export const updateProduct = async (id: number, data: Product): Promise<Product> => {
  const response = await api.patch(`/product/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/product/${id}`);
};
