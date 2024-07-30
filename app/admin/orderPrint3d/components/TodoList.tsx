import React from 'react';
import { Todo } from '../../../lib/projectsApi';
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
           <span
              className={`block  'line-through' }`}
            > 
              {todo.title}
            </span>
            {todo.description && (
              <span
                className={`block text-gray-400 'line-through'  ''}`}
              >
                {todo.description}
              </span>
  
            )}
            {todo.images && todo.images.map((image) => (
                <div key={image.id} className="flex flex-col items-center">
                  <Image
                    src={image.url}
                    alt={`Exhibition ${todo.title}`}
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