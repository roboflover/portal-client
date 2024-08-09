'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function PasswordReset() {
  const { resetPassword, error } = useAuth();
  const [email, setEmail] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingLogs(['Form submitted']);

    try {
      setLoadingLogs((prevLogs) => [...prevLogs, "Attempting password reset"]);
      await resetPassword(email);
      setLoadingLogs((prevLogs) => [...prevLogs, `Password reset email sent to: ${email}`]);
      setIsResetSuccessful(true);
      setResetError(null);
    } catch (error) {
      console.error('Password reset error:', error);
      setLoadingLogs((prevLogs) => [...prevLogs, 'Password reset error']);
      setIsResetSuccessful(false);
      setResetError('Password reset failed. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  if (isResetSuccessful) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Восстановление пароля</h2>
          <p className="text-center">An email with password reset instructions has been sent to {email}.</p>
          <button className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200" onClick={() => router.push('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Password Reset</h2>
        <form onSubmit={handlePasswordReset} className="space-y-4">
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
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Send Reset Link
          </button>
          {resetError && <p className="mt-2 text-sm text-red-600">{resetError}</p>}
        </form>
        {loading && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="text-sm font-medium">Loading logs:</h3>
            <ul className="text-xs">
              {loadingLogs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}