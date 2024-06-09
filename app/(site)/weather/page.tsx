'use client';

import { ChangeEvent, useState } from 'react';

type WeatherState = 
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; message: string };

const Home = () => {
  const [city, setCity] = useState('');
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  const [weatherState, setWeatherState] = useState<WeatherState>({ status: 'loading' });

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        q: city,
        appid: apiKey || '',
        units: 'metric'
      });

      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`);
      const dataObject = await response.json();
      let data = dataObject.main.temp;
      data = data.toFixed(1); // Округляем до одной десятой
      setWeatherState({ status: 'success', data });
      console.log(data);
    } catch (error) {
      console.error(error);
      setWeatherState({ status: 'error', message: 'An error occurred while fetching the weather data.' });
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='country'
          placeholder='Enter country'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button type='submit'>Submit</button>
      </form>
      <div>
        {weatherState.status === 'loading' && <p>Loading...</p>}
        {weatherState.status === 'success' && <p>Температура: {weatherState.data} градусов</p>}
        {weatherState.status === 'error' && <p>{weatherState.message}</p>}
      </div>
    </main>
  );
};

export default Home;
