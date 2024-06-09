// pages/exhibitions.tsx

'use client'

import { useEffect, useState } from 'react';

export default function Exhibitions() {
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch('/api');
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error('Error fetching the message:', error);
            }
        };

        fetchMessage();
    }, [])

    return (
        <div>
            <h1>API Message</h1>
            {message ? (
                <p>{message}</p>
            ):(
                <p>Loading...</p>
            )}
            
            
        </div>
    )
}
