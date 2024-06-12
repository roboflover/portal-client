import axios from 'axios';

const api = axios.create({
  baseURL: 'http://77.222.43.158:8080', // замените на ваш URL сервера
});

export interface Todo {
  id: number;
  title: string;
  description: string,
  imageUrl: string;
  createdAt: Date;
}

export const getTodos = async (): Promise<Todo[]> => {
    try{
        const response = await api.get('/exhibition');
        return response.data;
    } catch (error) {
        console.error('Error fetching exhibition:', error);
        throw error;
    }
};

export const createTodo = async (title: string): Promise<Todo> => {
  const response = await api.post('/exhibition', { title });
  return response.data;
};

export const updateTodo = async (id: number, data: Todo): Promise<Todo> => {
  const response = await api.patch(`/exhibition/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/exhibition/${id}`);
};
