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
    const [error, setError] = useState<string>('');

    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

    useEffect(() => {
        
    //     const params = new URLSearchParams();
    //     params.append('grant_type', 'client_credentials');
    //     params.append('client_id', client_id);
    //     params.append('client_secret', client_secret);
    //     console.log(params)
    //     try {
    //         const response = await axios.post('https://api.cdek.ru/v2/oauth/token/', params, {
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //         });
        
             setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJsb2NhdGlvbjphbGwiLCJvcmRlcjphbGwiLCJwYXltZW50OmFsbCJdLCJleHAiOjE3MjEzNjA4MzAsImF1dGhvcml0aWVzIjpbImNsaWVudC1jaXR5OtCh0LDQvdC60YIt0J_QtdGC0LXRgNCx0YPRgNCzLCDQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsyIsImZ1bGwtbmFtZTrQk9GA0LjQs9C-0YDRj9C9INCh0YLQtdC_0LDQvSDQndC40LrQvtC70LDQtdCy0LjRhyIsInNoYXJkLWlkOnJ1LTA0IiwiY29udHJhY3QtaWQ6NzlhMjNkZDQtOWMxNC00YTFlLWEwNzQtNWU3ZDVhNGUxNjQ2IiwiY29udHJhZ2VudC11dWlkOmFkOWRhNjZjLTBiMDMtNDIyMC05ZDE1LWFkYWI0OTQ4YWI4NCIsImFjY291bnQtdXVpZDoxNTJlYjdjMS1jNjY5LTRhY2UtYmVmYy0xNThjMzIwYTk0OGEiLCJhY2NvdW50LWxhbmc6cnVzIiwiYXBpLXZlcnNpb246Mi4wIiwiY2xpZW50LWlkLWVjNTphZDlkYTY2Yy0wYjAzLTQyMjAtOWQxNS1hZGFiNDk0OGFiODQiLCJjb250cmFjdDpJTS1TUEI0LTI0NzUiLCJjbGllbnQtZW1haWxzOmhvbG9yYWJiaXRAeWFuZGV4LnJ1LGhvbG9yYWJiaXRAeWFuZGV4LnJ1Iiwic29saWQtYWRkcmVzczpmYWxzZSIsImNsaWVudC1pZC1lYzQ6bnVsbCJdLCJqdGkiOiJEX1pWN191Qzg1ZldQTUpiRF9ublBDcjJoQ1EiLCJjbGllbnRfaWQiOiJ5aUdoRXlyUUF4SmMzWFZTTFl2dVJmc2hzcDhaMklxbiJ9.LQLw_4Rd-dPj7SjXz43LsGFIp5FCG-qKK9hUVyUQBNCl07jzkyLdmLZTHwNlSRA2M3x2ywZhNlfMD8HSZOJqyyBZTehI372hIFLhBO-maxnPdfdFMRcYvpn6R6zHqiNRFTZOPkNdgtGciNi5SxWWCxIRilNPVQCyzGDYloW4J3_ardEZo6vBmdybrYBhPHi_N9kOD6QrWK-CWdO3Isce0aR3useZOS021guKkU_nkfVMciGJnZR_F02bS-7PPebhmwTsQLGrKoAXYmxRceYOl74nhJutv6wr3e2LikWdWEvXqDst-0IyZdL7YAAuY2QOCtfVCIEVbtIC7VQ1FTFZ8Q');
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error('Axios error:', error.message);
    //             if (error.response) {
    //                 console.error('Status code:', error.response.status);
    //                 console.error('Data:', error.response.data);
    //                 console.error('Headers:', error.response.headers);
    //             } else if (error.request) {
    //                 console.error('Request was made but no response was received');
    //             } else {
    //                 console.error('Error setting up the request');
    //             }
    //         } else {
    //             console.error('Unexpected error:', error);
    //         }
        
    //         setError('Failed to fetch token');
    //     }
                
    //     };

    }, [client_id, client_secret]);

    useEffect(() => {
        const fetchCities = async () => {
            if (!token) return;

            setLoading(true);
            try {
                const response = await axios.get(`https://api.cdek.ru/v2/location/regions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        country_codes: 'RU'
                    }
                });

                if (Array.isArray(response.data)) {
                    const sortedCities = response.data.sort((a: City, b: City) =>
                        ["Москва", "Санкт-Петербург"].includes(b.name) ? 1 : -1);
                    setCities(sortedCities);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                setError('Failed to fetch cities');
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
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
