import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface City {
    code: string;
    name: string;
}

const CitySelector: React.FC = () => {
    const [token, setToken] = useState<string>('');
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

    useEffect(() => {
        const fetchToken = async () => {
            setIsLoading(true);
            setError('');
            if(client_id && client_secret){
                const params = new URLSearchParams();
                params.append('grant_type', 'client_credentials');
                params.append('client_id', client_id);
                params.append('client_secret', client_secret);

                try {
                    const response = await axios.post('https://api.cdek.ru/v2/oauth/token', params, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    setToken(response.data.access_token);
                    console.log('Token:', response.data.access_token); // Для отладки
                } catch (error) {
                    console.error('Error fetching token:', error);
                    setError('Failed to fetch token');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            setLoading(true);
            axios.get('https://api.cdek.ru/v2/location/regions', {
                headers: {
                    Authorization:'Bearer ${token}'
                },
                params: {
                    country_codes: 'RU'
                }
            }).then(response => {
                if (Array.isArray(response.data)) {
                    const sortedCities = response.data.sort((a: City, b: City) =>
                        ["Москва", "Санкт-Петербург"].includes(b.name) ? 1 : -1);
                    setCities(sortedCities);
                }
            }).catch(error => console.error('Error fetching cities:', error))
            .finally(() => setLoading(false));
        }
    }, [token]);

    return (
        <div className="max-w-md mx-auto mt-10">
            {loading ? (
                <p className="text-center text-lg text-gray-500">Загрузка...</p>
            ) : (
                <select className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50">
                    {cities.map(city => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default CitySelector;
