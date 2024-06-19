'use client'

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getProducts, updateProduct, deleteProduct, Product } from '../../lib/productApi';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import EditModal from './components/EditModal'; 

Modal.setAppElement('body'); 

const Home: React.FC = () => {

  const [todos, setTodos] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableTodo, setEditableTodo] = useState<Product | null>(null);

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

  const handleEdit = (id: number) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setEditableTodo(todoToEdit);
      setIsModalOpen(true);
    }
  };

  const handleSave = async (updatedTodo: Product) => {
    if (editableTodo) {
      const updatedProduct = await updateProduct(editableTodo.id, updatedTodo);
      setTodos(todos.map(todo => (todo.id === updatedProduct.id ? updatedProduct : todo)));
      setIsModalOpen(false);
      setEditableTodo(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-gray-900 text-white shadow-md rounded">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Редактирование товара"
        className="bg-white p-4 rounded shadow-lg w-96"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        {editableTodo && (
          <EditModal todo={editableTodo} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
        )}
      </Modal>

      <h1 className="text-2xl font-bold mb-4">Продукция</h1>
      <AddTodo onTodoAdded={fetchTodos} />
      <TodoList todos={todos} onDelete={handleDeleteTodo} onEdit={handleEdit} />
    </div>
  );
};

export default Home;
