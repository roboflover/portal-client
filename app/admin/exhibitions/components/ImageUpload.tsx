import React, { useState, useRef } from 'react';
import axios from 'axios';

interface ImageUploadProps {

}

const ImageUpload: React.FC<ImageUploadProps> = () => {
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setUploadProgress(null);
    setSuccessMessage(null);

    if (!selectedFile) {
      setError('Пожалуйста, выберите файл для загрузки');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.put('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      setSelectedFile(null);
      setUploadProgress(null);
      setSuccessMessage('Картинка успешно загружена на сервер');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Очистка поля ввода
      }
    } catch (error) {
      console.log(error);
      setError('Ошибка при загрузке изображения');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border p-2 rounded bg-gray-800 text-white placeholder-gray-500"
        />
        {uploadProgress !== null && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 flex-grow">
            <div
              className="bg-blue-700 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }} // Изменено на шаблонную строку
            ></div>
          </div>
        )}
        <button type="submit" className="bg-blue-700 text-white p-2 rounded hover:bg-blue-900">
          Загрузить
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default ImageUpload;