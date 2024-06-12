<<<<<<< HEAD
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://77.222.43.158:8080', // замените на ваш URL сервера
});

export interface Todo {
  id: number;
  title: string;
  description: string,
  createdAt: string,
  // isCompleted: boolean;
  imageUrl: string;
}

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
=======
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://77.222.43.158:80', // замените на ваш URL сервера
});

export interface Todo {
  id: number;
  title: string;
  description: string,
  createdAt: string,
  // isCompleted: boolean;
  imageUrl: string;
}

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
>>>>>>> 0152205cd560046514bfd20cefbd7f67a9d6f1a4
