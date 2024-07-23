import axios from "axios";
import { NextRequest } from "next/server";
import qs from "qs";

 export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Предполагается, что токен передается в заголовке Authorization
  
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is missing' }), { status: 401 });
    }
  
    try {
      const params = qs.stringify({
        country_codes: 'RU'
      });
  
      const response = await axios.get('https://api.cdek.ru/v2/location/country', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          country_codes: 'RU'
        }
      });
  
      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error('Error fetching cities:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), { status: 500 });
    }
  }