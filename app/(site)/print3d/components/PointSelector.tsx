import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RegionData } from './RegionSelector';

type UUID = string;

interface DeliveryPoint {
    code: string;
    location: any;
    name: string;
    uuid: UUID;
    nearest_station: string;
    address: string;
}

interface RegionSelectorProps {
  selectedRegion: RegionData | null;
  onAddressSelect: (region: string) => void;
  onDeliveryPointSelect: (deliveryPoint: string) => void;
}

const PointSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onAddressSelect, onDeliveryPointSelect }) => {

  const [regions, setRegions] = useState<RegionData[]>([]);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [searchText, setSearchText] = useState<string>(''); // Состояние для текста поиска
  const [address, setAdress] = useState<string>('')

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
      try {
        const response = await axios.get('/api/cdek/deliverypoints', {
          params: {
            region_code: selectedRegion.region_code // Передача region_code как параметра
          },
          headers: {
            Authorization: `Bearer ${token}` // Токен авторизации
          }
        });
        setDeliveryPoints(response.data)
      } catch (error) {
        console.error('Error fetching points:', error); // Логирование ошибки
        setError('Failed to fetch points'); // Установка сообщения об ошибке
      } finally {
        setLoading(false); // Сброс состояния загрузки
      }
    };
    fetchRegions();
  }, [token, selectedRegion]); // Зависимости эффекта
  
  const prioritizeCities = (regions: RegionData[]) => {
    const priorityCities = ['Москва', 'Санкт-Петербург'];
    const priorityRegions = regions.filter(region => priorityCities.includes(region.region));
    const otherRegions = regions.filter(region => !priorityCities.includes(region.region));
    return [...priorityRegions, ...otherRegions];
  };

  // Фильтрация точек выдачи на основе текста поиска
  const filteredDeliveryPoints = deliveryPoints.filter(point =>
    point.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAdress = deliveryPoints.find(point => point.uuid === event.target.value);
    if (selectedAdress && selectedRegion) {
      setAdress(`${selectedAdress.location.address}${selectedRegion.region}`);
      onAddressSelect(selectedAdress.location.address)
      onDeliveryPointSelect(selectedAdress.code)
      // console.log(selectedAdress)
    }
  };

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
          <select className='border p-2 rounded w-full' onChange={handleChange}>
            {filteredDeliveryPoints.map((point) => (
              <option key={point.uuid} value={point.uuid}>
                {point.name}
              </option>
            ))}
          </select>
          <p>{address}</p>
        </>
      )}
      {/* {error && <p>{error}</p>} */}
    </div>
  );
};

export default PointSelector;

