import axios from 'axios';

const host = process.env.NEXT_PUBLIC_SERVER;
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  imageUrl: string;
  createdAt: Date;
  images?: Image[];
  isPinned?: boolean;
  date?: Date;
}

interface Image {
  id: number;
  url: string;
  productId?: number;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/product');
    return response.data;
  } catch (error) {
    console.error('Error fetching Products:', error);
    throw error;
  }
};

export const createProduct = async (data: Product): Promise<Product> => {
  const response = await api.post('/product', { data });
  return response.data;
};

export const updateProduct = async (id: number, data: Product): Promise<Product> => {
  const response = await api.patch(`/product/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/product/${id}`);
};
