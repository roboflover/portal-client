import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RegionData } from '../interface/RegionData.interface';
import { DeliveryPoint } from '../interface/DeliveryPoint.interface';

type UUID = string;

interface RegionSelectorProps {
  selectedRegion: RegionData | null;
  onAddressSelect: (address: string) => void;
  onDeliveryPointSelect: (deliveryPoint: string) => void;
  onDeliveryPointsChange: (deliveryPoints: DeliveryPoint[]) => void;
}

const PointSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onAddressSelect, onDeliveryPointSelect, onDeliveryPointsChange }) => {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [searchText, setSearchText] = useState<string>(''); // Состояние для текста поиска
  const [address, setAddress] = useState<string>('');

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
    if (deliveryPoints.length > 0) {
      onDeliveryPointsChange(deliveryPoints);
    }
  }, [deliveryPoints, onDeliveryPointsChange]);

  useEffect(() => {
    const fetchRegions = async () => {
      if (!token || !selectedRegion || !selectedRegion.region_code) return;
      setLoading(true);
      try {
        const response = await axios.get('/api/cdek/deliverypoints', {
          params: {
            region_code: selectedRegion.region_code // Передача region_code как параметра
          },
          headers: {
            Authorization: `Bearer ${token}` // Токен авторизации
          }
        });
        setDeliveryPoints(response.data);
      } catch (error) {
        console.error('Error fetching points:', error); // Логирование ошибки
        setError('Failed to fetch points'); // Установка сообщения об ошибке
      } finally {
        setLoading(false); // Сброс состояния загрузки
      }
    };
    fetchRegions();
  }, [token, selectedRegion]); // Зависимости эффекта

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = deliveryPoints.find(point => point.uuid === event.target.value);
    if (selectedAddress && selectedRegion) {
      setAddress(`${selectedAddress.location.address}, ${selectedRegion.region}`);
      onAddressSelect(selectedAddress.location.address);
      onDeliveryPointSelect(`${selectedAddress.code}, ${selectedAddress.location.address}`);
    }
  };

  // Фильтрация точек выдачи на основе текста поиска
  const filteredDeliveryPoints = deliveryPoints.filter(point =>
    point.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className='border rounded w-64'>
      {loading ? <p>Загрузка пунктов выдачи...</p> : (
        <>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Поиск..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select className='border p-2 rounded w-full text-gray-500' onChange={handleChange}>
            {filteredDeliveryPoints.map((point) => (
              <option key={point.uuid} value={point.uuid}>
                {point.name}
              </option>
            ))}
          </select>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PointSelector;
