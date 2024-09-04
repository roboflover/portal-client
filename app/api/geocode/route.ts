import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// Определяем типы для входных и выходных данных
interface GeocodeResponse {
  lat: string;
  lon: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('region');

  if (!address) {
    return NextResponse.json({ error: 'Отсутствует параметр адреса' }, { status: 400 });
  }

  try {
    // Делаем запрос к Nominatim API для геокодирования
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: 'json',
      },
    });

    if (response.data.length === 0) {
      return NextResponse.json({ error: 'Адрес не найден' }, { status: 404 });
    }

    const { lat, lon } = response.data[0];

    return NextResponse.json({ lat, lon }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
