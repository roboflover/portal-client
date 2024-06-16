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

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {

    const token = Cookies.get('access_token');
    if (!token) {
        throw new Error('No token found');
    }

    const host = process.env.NEXT_PUBLIC_SERVER

    if (!host) {
        throw new Error('Server host is not defined');
    }

    const response = await axios.get(`${host}/auth/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

