// import React, { useRef, useState } from 'react';
// import axios from 'axios';

// interface AddReviewPrint3dProps {
//   onReviewPrint3dAdded: () => void; // Callback функция для обновления списка отзывов после добавления нового
// }

// const AddReviewPrint3d: React.FC<AddReviewPrint3dProps> = ({ onReviewPrint3dAdded }) => {
//   const host = process.env.NEXT_PUBLIC_SERVER;

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadProgress, setUploadProgress] = useState<number | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedTitle, setTitle] = useState<string>('');
//   const [selectedDescription, setDescription] = useState<string>('');

//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError(null);
//     setUploadProgress(null);
//     setSuccessMessage(null);

//     if (!selectedFile) {
//       setError('Пожалуйста, выберите изображение');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile); // Ключ 'file' для файла
//     formData.append('title', selectedTitle); // Ключ 'title' для заголовка
//     formData.append('description', selectedDescription); // Ключ 'description' для описания

//     try {
//       await axios.post(`${host}/review-print3d/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(percentCompleted);
//           }
//         },
//       });

//       setSelectedFile(null);
//       setUploadProgress(null);
//       setSuccessMessage('Отзыв успешно добавлен');
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''; // Очистка поля ввода
//       }
//       setTitle('');
//       setDescription('');
//       onReviewPrint3dAdded(); // Вызов callback функции после успешного добавления
//     } catch (error) {
//       console.log(error);
//       setError('Ошибка при добавлении отзыва или загрузке изображения');
//     }
//   };

//   return (
//     <div className="mb-4">
//       <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="border p-2 rounded bg-gray-800 text-white placeholder-gray-500"
//         />
//         {uploadProgress !== null && (
//           <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 flex-grow">
//             <div
//               className="bg-blue-700 h-2.5 rounded-full"
//               style={{ width: `${uploadProgress}%` }} // Изменено на шаблонную строку
//             ></div>
//           </div>
//         )}
//         <input
//           type="text"
//           value={selectedTitle}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Введите заголовок"
//           required
//           className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
//         />
//         <textarea
//           value={selectedDescription}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Введите описание"
//           required
//           rows={4} // Количество строк по умолчанию
//           className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-500"
//         ></textarea>
//         <button type="submit" className="bg-blue-700 text-white p-2 rounded hover:bg-blue-900">
//           Добавить
//         </button>
//       </form>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
//     </div>
//   );
// };

// export default AddReviewPrint3d;
