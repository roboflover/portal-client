import React, { useRef, useState } from 'react';
import axios from 'axios';

interface AddTodoProps {
  onTodoAdded: () => void; // Callback функция для обновления списка заданий после добавления нового
}

const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
  const host = process.env.NEXT_PUBLIC_SERVER;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDescription, setDescription] = useState<string>('');
  const [selectedTitle, setTitle] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [links, setLinks] = useState<string[]>(['']);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => {
    setLinks([...links, '']);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setUploadProgress(null);
    setSuccessMessage(null);
    if (!selectedFile) {
      setError('Пожалуйста, выберите изображение');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile); // Ключ 'file' для файла
    formData.append('title', selectedTitle); // Ключ 'title' для заголовка
    formData.append('description', selectedDescription); // Ключ 'description' для описания
    if (price !== null) formData.append('price', price.toString()); // Ключ 'price' для цены
    formData.append('links', JSON.stringify(links));
    formData.append('isPinned', isPinned.toString()); // Ключ 'isPinned' для закрепления
    try {
      await axios.post(`${host}/product/upload`, formData, {
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
      setSuccessMessage('Задание успешно добавлено');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Очистка поля ввода
      }
      setTitle('');
      setDescription('');
      setPrice(null);
      setLinks(['']);
      setIsPinned(false);
      onTodoAdded(); // Вызов callback функции после успешного добавления
    } catch (error) {
      console.log(error);
      setError('Ошибка при добавлении задания или загрузке изображения');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
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
        )}<input
        type="text"
        value={selectedTitle}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Введите новое задание"
        required
        className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
      />
      <textarea
        value={selectedDescription}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Введите описание"
        required
        rows={4} // Количество строк по умолчанию
        className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
      ></textarea>
      <input
        type="number"
        value={price !== null ? price : ''}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        placeholder="Введите цену"
        required
        className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
      />
      {links.map((link, index) => (
        <input
          key={index}
          type="text"
          value={link}
          onChange={(e) => handleLinkChange(index, e.target.value)}
          placeholder={`Ссылка ${index + 1}`}
          className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
        />
      ))}
      <button type="button" onClick={addLinkField} className="bg-green-700 text-white p-2 rounded hover:bg-green-900">
        Добавить ссылку
      </button>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span className="text-white">Закрепить</span>
      </label>
      <button type="submit" className="bg-blue-700 text-white p-2 rounded hover:bg-blue-900">
        Добавить
      </button>
    </form>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
  </div>
);
};

export default AddTodo;