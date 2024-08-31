// ErrorPopup.tsx
import React from 'react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p className="text-red-500">{message}</p>
        <button onClick={onClose} className="mt-2 text-blue-500 hover:underline">
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;