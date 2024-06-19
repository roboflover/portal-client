 'use client'

import React, { useState } from 'react';
import { Product } from '../../../lib/productApi';
import { useRouter } from 'next/navigation';

interface EditModalProps {
  todo: Product;
  onSave: (updatedTodo: Product) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ todo, onSave, onClose }) => {
  
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [price, setPrice] = useState(todo.price);

  const handleSave = () => {
    const updatedTodo = { ...todo, title, description, price };
    onSave(updatedTodo);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Редактирование товара</h2>
      <div className="mb-4">
        <label className="block mb-1">Название</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Цена аренды (руб.)</label>
        <input
          type="number"
          value={price}
          onChange={(e)=> setPrice(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
          Отмена
        </button>
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default EditModal;
