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
        const response = await axios.post('https://api.cdek.ru/v2/calculator/tarifflist', {
            "lang": "rus",
            "from_location": {
                "code": 82
            },
            "to_location": {
                "code": region_code
            },
            "packages": [
                {
                    "height": 25,
                    "length": 25,
                    "weight": 1000,
                    "width": 10
                }
            ]
        }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
  
      return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
      console.error('Error fetching cities:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), { status: 500 });
    }
  }