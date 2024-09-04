
'use client';

import React, { useEffect, useState } from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps-no-default-props';
import { RegionData } from '../../interface/RegionData.interface';
import { DeliveryPoint } from '../../interface/DeliveryPoint.interface';

interface RegionCoord {
  lat: string;
  lon: string;
}

interface SelectedRegionProps {
  selectedRegion: RegionCoord;
  onDeliverySumChange: (sum: number) => void;
  deliveryPoints: DeliveryPoint[];
  onDeliveryPointClick: (point: DeliveryPoint) => void; // Добавляем новый пропс
}

const apiKey = process.env.NEXT_PUBLIC_YMAPS_API_KEY;
const defaultCenter: [number, number] = [55.76, 37.64];

const YandexMap: React.FC<SelectedRegionProps> = ({ selectedRegion, onDeliverySumChange, deliveryPoints, onDeliveryPointClick }) => {
  const [coordinates, setCoordinates] = useState<[number, number]>(defaultCenter);

  useEffect(() => {
    if (selectedRegion.lat && selectedRegion.lon) {
      const newCoordinates: [number, number] = [
        parseFloat(selectedRegion.lat),
        parseFloat(selectedRegion.lon)
      ];

      if (coordinates[0] !== newCoordinates[0] || coordinates[1] !== newCoordinates[1]) {
        setCoordinates(newCoordinates); // Остановка бесконечного цикла рендеринга
      }
    }
  }, [selectedRegion]);

  return (
    <YMaps query={{ load: 'package.full', apikey: apiKey }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Map
          defaultState={{
            center: coordinates,
            zoom: 9,
            controls: [],
          }}
          width="100%"
          height="100%"
        >
          {deliveryPoints.map((point) => (
            <Placemark
              key={point.uuid}
              geometry={[point.location.latitude, point.location.longitude]}
              properties={{
                balloonContent: `<strong>${point.name}</strong><br>${point.location.address}`
              }}
              modules={['geoObject.addon.balloon']} // Для отображения balloon
              onClick={() => onDeliveryPointClick(point)} // Добавляем обработчик клика
            />
          ))}
        </Map>
      </div>
    </YMaps>
  );
};

export default YandexMap;