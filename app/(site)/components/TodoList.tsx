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
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-2 border rounded">
          <div className="flex-grow">
            <span className="block  text-sm">
              {new Date(todo.createdAt).toLocaleString()}
            </span>
            <span className="block font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {todo.title}
            </span>
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
            {todo.description && (
              <span className="block">
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
