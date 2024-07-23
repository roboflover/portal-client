'use client';

import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import Modal from 'react-modal';

if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_SERVER;
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorRegister, setShowErrorRegister] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Сбросить предыдущее сообщение об ошибке
    setShowRegisterModal(true)
    setTimeout(()=>{
      setShowRegisterModal(false);
    }, 3000 ) 
    try {
      await axios.post(`${host}/auth/register`, {
        name,
        email,
        password,
      });
      console.log('register successful')
      setShowRegisterModal(false)
      setShowSuccessPopup(true)
      setTimeout(()=>{
        router.push('/');
      }, 3000 ) 
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const serverErrorMessage = error.response.data.message;
        setErrorMessage(serverErrorMessage);
      } else {
        setErrorMessage('Ошибка, попробуйте ещё раз');
      }
      console.error(error);
      setShowErrorRegister(true)
      setTimeout(()=>{
        setShowErrorRegister(false)
      }, 3000)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              id="name"
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 pr-12"
              />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-sm text-gray-700 bg-transparent border-l border-gray-300 appearance-none"
                >
                {showPassword ? <EyeOff/> : <Eye/>}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Регистрация
          </button>
          {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
        </form>
      </div>

      <Modal
        isOpen={showSuccessPopup}
        onRequestClose={() => setShowSuccessPopup(false)}
        contentLabel="Подтвердите электронную почту"
        className="fixed top-0 left-0 right-0 flex items-center justify-center m-0 bg-green-500 text-white p-4 rounded-b-md shadow-md"
        overlayClassName="pointer-events-none"
      >
        <div className="text-center text-lg font-semibold">
          Подтвердите электронную почту
        </div>
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onRequestClose={() => setShowRegisterModal(false)}
        contentLabel="Регистрация в процессе"
        className="fixed top-0 left-0 right-0 flex items-center justify-center m-0 bg-green-500 text-white p-4 rounded-b-md shadow-md"
        overlayClassName="pointer-events-none"
      >
        <div className="text-center text-lg font-semibold">
        Регистрация в процессе
        </div>
      </Modal>

      <Modal
        isOpen={showErrorRegister}
        onRequestClose={() => setShowErrorRegister(false)}
        contentLabel="Ошибка сервера, извините :-)"
        className="fixed top-0 left-0 right-0 flex items-center justify-center m-0 bg-red-500 text-white p-4 rounded-b-md shadow-md"
        overlayClassName="pointer-events-none"
      >
        <div className="text-center text-lg font-semibold">
        Ошибка сервера, извините :-)
        </div>
      </Modal>

    </div>
  );
}