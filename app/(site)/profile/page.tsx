// profile/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/api/profile';  // Импортируем функцию из нового файла
import { Metadata } from 'next';
import { useAuth } from '@/app/(auth)/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
}

export default function Profile() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, setIsAuthenticated, logout } = useAuth();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                const data = await fetchUserProfile();
                setUserProfile(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setIsAuthenticated(false);
                        logout()
                        router.push('/')
                    }                } else {
                    //setError((err as Error).message);
                }
            } finally {
                setLoading(false);
            }
        };

        getUserProfile();
    }, [logout, router, setIsAuthenticated]);

    return (
        <div>
            <h1>Профиль</h1>
            {userProfile ? (
                <div>
                    <p>Имя: {userProfile.name}</p>
                    <p>Почта: {userProfile.email}</p>
                    <p>Роль: {userProfile.role}</p>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
