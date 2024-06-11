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
        console.log(data)
        setTodos(data);
      };

    // useEffect(() => {
    //     const fetchMessage = async () => {
    //         try {
    //             const response = await fetch('/api');
    //             const data = await response.json();
    //             setMessage(data.message);
    //         } catch (error) {
    //             console.error('Error fetching the message:', error);
    //         }
    //     };

    //     fetchMessage();
    // }, [])

    return (
        <div>
            <TodoList todos={todos}  />

        </div>
    )
}
