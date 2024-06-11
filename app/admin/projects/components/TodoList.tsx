import React from 'react';
import { Todo } from '../../../lib/projectsApi';

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
            {todo.imageUrl && (
              <img
                src={todo.imageUrl}
                alt={todo.title}
                className="mt-2 max-w-full h-auto rounded"
              />
            )}
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