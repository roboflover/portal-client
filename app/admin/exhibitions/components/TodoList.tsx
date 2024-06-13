import React from 'react';
import { Todo } from '../../../lib/api';
import Image from 'next/image';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onDelete }) => {

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
            <span className="block">{todo.title}</span>
            {todo.description && (
              <span className="block text-gray-400">{todo.description}</span>
            )}
            {todo.imageUrl && (
              <Image
              src={todo.imageUrl}
              alt={todo.title}
              width={800} // Укажите ширину изображения
              height={600} // Укажите высоту изображения
              className="mt-2 max-w-full h-auto rounded"
              priority={true}
            />
            )}
            <span className="block text-gray-500 text-sm mt-1">
            Создано: {new Date(todo.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete(todo.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
