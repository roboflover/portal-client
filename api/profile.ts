// api/profile.ts

import axios from 'axios';
import Cookies from 'js-cookie';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    // Добавьте другие поля по мере необходимости
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
    const token = Cookies.get('access_token');

    if (!token) {
        throw new Error('No token found');
    }

    const response = await axios.get('http://localhost:3000/auth/profile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
