'use client'
import React, { useEffect, useState } from 'react';
import { getProducts, updateProduct, deleteProduct, Product } from '../../lib/exhibitionsApi';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
// import ImageUpload from './components/ImageUpload';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Product[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const data = await getProducts();
    setTodos(data);
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteProduct(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      {/* <h1 className="text-2xl font-bold mb-4">Загрузить изображение</h1>
      <ImageUpload /> */}
      <h1 className="text-2xl font-bold mb-4">Выставки</h1>
      <AddTodo onTodoAdded={fetchTodos} />
      <TodoList todos={todos} onDelete={handleDeleteTodo} />
    </div>
  );
};

export default Home;