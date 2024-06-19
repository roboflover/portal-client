import React, { useState } from 'react';
import { Product } from '../../../lib/productApi';
import Image from 'next/image';

interface TodoListProps {
  todos: Product[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

interface Image {
  id: number;
  url: string;
  catalogId?: number;
  projectId?: number;
  productId?: number;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDelete, onEdit }) => {

  return (
    <ul className="space-y-2"> 
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
            <span className="block">{todo.title}</span>
            {todo.description && (
              <span className="block text-gray-400">{todo.description}</span>
            )}
            {todo.images && todo.images.map((image) => (
                <div key={image.id} className="flex flex-col items-center">
                  <Image
                    src={image.url}
                    alt={`Catalog ${todo.title}`}
                    width={800}
                    height={600}
                    className="max-w-full h-auto rounded"
                    priority={true}
                  />
                </div>
              ))}
            <span className="block text-gray-500 text-sm mt-1">
              Создано: {new Date(todo.createdAt).toLocaleString()}
            </span>
            <span className="block text-gray-500 text-sm mt-1">
              Цена аренды: {todo.price} руб.
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => onEdit(todo.id)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
