import React from 'react';
import { Todo } from '../../lib/projectsApi';
import Image from 'next/image';

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-2 border rounded bg-gray-800 text-white">
          <div className="flex-grow">
            <span className="block text-gray-500 text-sm">
              {new Date(todo.createdAt).toLocaleString()}
            </span>
            <span className="block font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {todo.title}
            </span>
            {todo.imageUrl && (
              <div className="flex justify-center mt-2">
                <Image
                  src={todo.imageUrl}
                  alt={todo.title}
                  width={500} // Укажите желаемую ширину
                  height={300} // Укажите желаемую высоту
                  className="max-w-full h-auto rounded"
                  priority={true}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            )}
            {todo.description && (
              <span className="block text-gray-400">
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
