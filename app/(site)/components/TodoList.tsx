import React from 'react';
import { Todo } from '../../lib/projectsApi';
import Image from 'next/image';

interface TodoListProps {
  todos: Todo[];
}

interface Image {
  id: number;
  url: string;
  exhibitionId?: number;
  projectId?: number;
  productId?: number;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li key={todo.id} className="relative p-4 border rounded overflow-hidden" style={{ paddingTop: '75%' }}>
          {todo.images && todo.images[0] && (
           <Image
           src={todo.images[0].url}
           alt={`Exhibition ${todo.title}`}
           fill
           style={{ objectFit: 'cover' }}
           className="absolute inset-0 w-full h-full z-0"
           priority={true} // Добавляем priority только для первого изображения
         />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 p-4 rounded z-10">
            <span className="block text-white text-sm mb-2">
              {new Date(todo.createdAt).toLocaleString()}
            </span>
            <span className="block font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white mb-2">
              {todo.title}
            </span>
            {todo.description && (
              <span className="block text-white">
                {todo.description}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
