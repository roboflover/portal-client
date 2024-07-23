import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RegionData } from './RegionSelector';

type UUID = string;

interface DeliveryPoint {
    location: any;
    name: string;
    uuid: UUID;
    nearest_station: string;
    address: string;
}

interface SelectedRegion {
    selectedRegion: RegionData | null
}

const Calculator: React.FC<SelectedRegion> = ({ selectedRegion }) => {

  const [regions, setRegions] = useState<RegionData[]>([]);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [deliverySum,  setDeliverySum] = useState<number | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post('/api/cdek'); // Предполагается, что API для получения токена находится по адресу /api/token
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
        setError('Failed to fetch token');
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      if (!token || !selectedRegion || !selectedRegion.region_code) return;
      setLoading(true);
      setError(''); // Сброс состояния ошибки перед новым запросом
      try {
        const response = await axios.get('/api/cdek/calculator', {
          params: {
            region_code: selectedRegion.region_code // Передача region_code как параметра
          },
          headers: {
            Authorization: `Bearer ${token}` // Токен авторизации
          }
        });
        const sum = Math.round(response.data.tariff_codes[3].delivery_sum / 100) * 100;
        setDeliverySum(sum);
      } catch (error) {
        console.error('Error fetching points:', error);  // Логирование ошибки
        // setError(`Failed to fetch points: ${error.message}`); // Установка сообщения об ошибке
      } finally {
        setLoading(false); // Сброс состояния загрузки
      }
    };
    fetchRegions();
  }, [token, selectedRegion]); // Зависимости эффекта
  
  return (
    <div className='border rounded w-full'>
        <div className="relative">
          {loading ? (
            <p>Загрузка стоимости доставки...</p>
          ) : (
            <p>Стоимость доставки: {deliverySum !== null ? `${deliverySum}₽` : 'Ой..'}</p>
          )}
          {/* {error && <p>{error}</p>} */}
        </div>
    </div>
  );
};

export default Calculator;
