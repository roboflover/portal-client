    // pages/api/weather.ts

    import type { NextApiRequest, NextApiResponse } from 'next';
    import axios from 'axios';

    export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
      const { city } = req.query;

      if (!city) {
        return res.status(400).json({ error: 'City is required' });
      }

      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
            q: city,
            appid: apiKey,
            units: 'metric'
          }
        });

        return res.status(200).json(response.data);
      } catch (error) {
        return res.status(500).json({ error: 'Error fetching weather data' });
      }
    }
    
