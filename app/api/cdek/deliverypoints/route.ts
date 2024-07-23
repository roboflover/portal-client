import axios from "axios";
import { NextRequest } from "next/server";
import qs from "qs";

 export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Предполагается, что токен передается в заголовке Authorization
    const region_code = req.nextUrl.searchParams.get('region_code'); // Получение параметра region_code из URL

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is missing' }), { status: 401 });
    }
  
    try {
    //   const { region_code } = await req.json()
      // console.log(region_code)
      const response = await axios.get('https://api.cdek.ru/v2/deliverypoints', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          country_codes: 'RU',
          region_code: region_code
        }
      });
  
      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error('Error fetching cities:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), { status: 500 });
    }
  }