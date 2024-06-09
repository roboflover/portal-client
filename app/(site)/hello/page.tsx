'use client';

import { ChangeEvent, useState } from 'react';

const Home = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/hello/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const {message} = await response.json();

      alert(message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main >
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit'>Submit</button>
      </form>
    </main>
  );
};

export default Home;