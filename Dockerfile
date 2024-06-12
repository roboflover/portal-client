# Используем официальный образ Node.js
FROM node:20.1-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Сборка приложения
RUN npm run build

# Экспонируем порт 3000 для Next.js
EXPOSE 8080

# Запуск приложения
CMD ["npm", "start"]
