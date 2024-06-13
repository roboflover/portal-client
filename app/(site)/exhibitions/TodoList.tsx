import React from 'react';
import { Todo } from '../../lib/api';
import Image from 'next/image';

interface TodoListProps {
  todos: Todo[]
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-2 border rounded ">
          <div className="flex-grow">
            <span className="block  text-sm">
              {/* Создано: {new Date(todo.createdAt).toLocaleString()} */}
            </span>
            <span className="block line">
              {todo.title}
            </span>
            {todo.description && (
              <span className="block   line-through">
                {todo.description}
              </span>
            )}
            {todo.imageUrl && (
              <div className="flex justify-center mt-2">
               <Image
                  src={todo.imageUrl}
                  alt={todo.title}
                  width={500} // Укажите подходящую ширину
                  height={300} // Укажите подходящую высоту
                  className="max-w-full h-auto rounded"
                  priority={true}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
