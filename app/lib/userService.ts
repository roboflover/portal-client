export async function getUserProfile(token: string) {
    // Логика для получения профиля пользователя по токену
    // Здесь вы можете использовать вашу базу данных или другой источник данных
    // Пример:
    return {
      sub: 'user-id',
      email: 'user@example.com',
      name: 'John Doe'
    };
  }
  
  export async function getUserById(id: string) {
    // Логика для получения пользователя по ID
    // Здесь вы можете использовать вашу базу данных или другой источник данных
    // Пример:
    return {
      id,
      email: 'user@example.com',
      name: 'John Doe'
    };
  }
  