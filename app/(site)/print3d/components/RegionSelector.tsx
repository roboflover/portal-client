import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {RegionData} from '../interface/RegionData.interface'

interface RegionSelectorProps {
  onRegionSelect: (region: RegionData) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ onRegionSelect }) => {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.post('/api/cdek'); // Предполагается, что API для получения токена находится по адресу /api/token
        setToken(response.data.access_token);
      } catch (error) {
        // console.error('Error fetching token:', error);
        setError('Failed to fetch token');
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.get('/api/cdek/regions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sortedRegions = prioritizeCities(response.data);
        setRegions(sortedRegions);
      } catch (error) {
        console.error('Error fetching regions:', error);
        setError('Failed to fetch regions');
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, [token]);

  const prioritizeCities = (regions: RegionData[]) => {
    const priorityCities = ['Москва', 'Санкт-Петербург'];
    const priorityRegions = regions.filter(region => priorityCities.includes(region.region));
    const otherRegions = regions
      .filter(region => !priorityCities.includes(region.region))
      .sort((a, b) => a.region.localeCompare(b.region));
    return [...priorityRegions, ...otherRegions];
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = regions.find(region => region.fias_region_guid === event.target.value);
    if (selectedRegion) {
      onRegionSelect(selectedRegion);
    }
  };

  return (
<div className='border rounded text-center m-auto w-full'>
  {loading ? <p>Загрузка региона...</p> : (
    <select className='border p-2 rounded w-full text-gray-500' onChange={handleChange}>
      <option value="" disabled>Выберите регион</option>
      {regions.map((region, index) => (
        <option key={index} value={region.fias_region_guid}>
          {region.region} ({region.country})
        </option>
      ))}
    </select>
  )}
  {/* {error && <p>{error}</p>} */}
</div>
  );
};

export default RegionSelector;
