// lib/multer-config.ts
import multer from 'multer';
import path from 'path';

// Указываем директорию для временного хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Используем уникальное имя файла
  },
});

const upload = multer({ storage });

export default upload;
