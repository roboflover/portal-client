'use client';

import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/app/lib/profile';  // Импортируем функцию из нового файла
import { useAuth } from '@/app/context/AuthContext';
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
    const { isAuthenticated, setIsAuthenticated, logout, userId, role, token } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                if (userId) {
                    const data = await fetchUserProfile(userId.toString());
                    setUserProfile(data);
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 401) {
                        setIsAuthenticated(false);
                        logout();
                        router.push('/');
                    }
                } else {
                    //setError((err as Error).message);
                }
            } finally {
                setLoading(false);
            }
        };

        getUserProfile();
    }, [logout, router, setIsAuthenticated, userId]);

    // Функция для смены пароля
    const handleChangePassword = async (event: React.FormEvent) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordChangeError('Пароли не совпадают');
            return;
        }
        try {
            const host = process.env.NEXT_PUBLIC_SERVER;
            const response = await axios.post(`${host}/auth/change-password`, {
                oldPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Password changed successfully:', response.data);
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                setPasswordChangeError(error.response?.data.message || 'Ошибка смены пароля');
            } else {
                setPasswordChangeError('Ошибка смены пароля');
            }
        }
    };

    return (
        <div>
            <h1>Профиль</h1>
            {loading ? (
                <p>Loading...</p>
            ) : userProfile ? (
                <div>
                    <p>Имя: {userProfile.name}</p>
                    <p>Почта: {userProfile.email}</p>
                    <p>Роль: {userProfile.role}</p>
                    <form onSubmit={handleChangePassword} className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label htmlFor="old-password" className="block text-sm font-bold mb-2">Старый пароль:</label>
                            <input
                                type={oldPasswordVisible ? "text" : "password"}
                                id="old-password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <small
                                onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                                className="cursor-pointer text-xs">
                                {oldPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                            </small>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="new-password" className="block text-sm font-bold mb-2">Новый пароль:</label>
                            <input
                                type={newPasswordVisible ? "text" : "password"}
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <small
                                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                                className="cursor-pointer text-xs">
                                {newPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                            </small>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirm-password" className="block text-sm font-bold mb-2">Повторите новый пароль:</label>
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <small
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                className="cursor-pointer text-xs">
                                {confirmPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                            </small>
                        </div>
                        {passwordChangeError && <p className="text-red-500 text-xs italic">{passwordChangeError}</p>}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            > Сменить пароль
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <p>Ошибка загрузки профиля</p>
            )}
        </div>
    );
}