'use client'

import React, { useEffect, useRef } from 'react';

const ModalMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  
  useEffect(() => {
    if (!mapContainerRef.current) return; // Handle ref not set

    const ymapsLoader = () => {
      window.ymaps.ready(() => {
        if (mapRef.current) {
          return; // Карта уже инициализирована, выходим
        }

        const myMap = new window.ymaps.Map(mapContainerRef.current, {
          center: [55.751574, 37.573856], // Координаты центра карты (Москва, Красная площадь)
          zoom: 9,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем почтовое отделение в центре карты как пример
        const myPlacemark = new window.ymaps.Placemark([55.751574, 37.573856], {
          balloonContent: 'Почтовое отделение'
        });

        myMap.geoObjects.add(myPlacemark);
        mapRef.current = myMap; // Сохраняем ссылку на карту в ref
      });
    };

    // Лоадер YMaps
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=ваш_api_ключ';
      script.async = true;
      script.onload = ymapsLoader;
      document.body.appendChild(script);
    } else {
      ymapsLoader();
    }
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '300px' }}>
        Загрузка карты...
      </div>
    </div>
  );
};

export default ModalMap;
