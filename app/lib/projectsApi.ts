import axios from 'axios';
import { env } from 'process';

const host = process.env.NEXT_PUBLIC_SERVER
const api = axios.create({
  baseURL: host, // замените на ваш URL сервера
});

interface Image {
  id: number;
  url: string;
  exhibitionId?: number;
  projectId?: number;
  productId?: number;
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  images?: Image[];
  createdAt: string,
    // price: number;
}

// export interface Todo {
//   id: number;
//   title: string;
//   description: string,
//   createdAt: string,
//   // isCompleted: boolean;
//   imageUrl: string;
// }

export const getTodos = async (): Promise<Todo[]> => {
    try{
      const response = await api.get('/project');
        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
    }
};

export const createTodo = async (title: string): Promise<Todo> => {
  const response = await api.post('/project', { title });
  return response.data;
};

export const updateTodo = async (id: number, data: Todo): Promise<Todo> => {
  const response = await api.patch(`/project/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/project/${id}`);
};
