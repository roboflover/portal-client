// api/profile.ts

import axios from 'axios';
import Cookies from 'js-cookie';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    // Добавьте другие поля по мере необходимости
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
    const token = Cookies.get('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const host = process.env.SERVER_HOST
    if (!host) {
        throw new Error('Server host is not defined');
    }

    const response = await axios.get(host, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

