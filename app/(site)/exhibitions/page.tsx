// pages/exhibitions.tsx

'use client'
import { getTodos, updateTodo, deleteTodo, Todo } from '../../lib/api';
import { useEffect, useState } from 'react';
import TodoList from './TodoList';

export default function Exhibitions() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        fetchTodos();
      }, []);
    
      const fetchTodos = async () => {
        const data = await getTodos();
        setTodos(data);
      };

    return (
        <div>
            <TodoList todos={todos}  />

        </div>
    )
}
