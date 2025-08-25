# Komfortel API

Современное REST API для управления пользователями, построенное на NestJS с TypeScript и PostgreSQL.

## Технологии

- **Backend Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.x
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Security**: Helmet, JWT, bcryptjs

## Функциональность

### Пользователи (Users)

- ✅ Создание пользователей
- ✅ Получение списка всех пользователей
- ✅ Поиск пользователя по ID, email или login
- ✅ Обновление данных пользователя
- ✅ Управление статусом пользователя (active/inactive/suspended)
- ✅ Удаление пользователей
- ✅ Загрузка аватара пользователя
- ✅ Валидация данных с помощью class-validator

### Системные возможности

- ✅ Health check endpoint
- ✅ Swagger документация
- ✅ Глобальная обработка ошибок
- ✅ Трансформация ответов
- ✅ CORS настройки
- ✅ Сжатие ответов (compression)
- ✅ Безопасность (helmet)
- ✅ Логирование в development режиме

## Архитектура

```
src/
├── common/                 # Общие компоненты
│   ├── controllers/       # Health controller
│   ├── filters/          # HTTP exception filter
│   ├── interceptors/     # Transform interceptor
│   ├── interfaces/       # API response interface
│   └── pipes/           # Validation pipe
├── config/              # Конфигурация приложения
│   └── database.config.ts
├── database/            # База данных
│   ├── entities/        # TypeORM сущности
│   ├── migrations/      # Миграции базы данных
│   └── seeds/          # Сидеры данных
├── modules/            # Модули приложения
│   └── users/          # Модуль пользователей
│       ├── controllers/ # Контроллеры
│       ├── dto/        # Data Transfer Objects
│       ├── interfaces/ # Интерфейсы
│       ├── repositories/ # Репозитории
│       └── services/   # Бизнес-логика
└── main.ts             # Точка входа
```

## Быстрый старт

### Предварительные требования

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (если запуск без Docker)

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd komfortel_api
```

### 2. Настройка переменных окружения

```bash
cp env.example .env
```

Отредактируйте `.env` файл под ваши настройки:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=komfortel_api

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 3. Запуск с Docker (рекомендуется)

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f api

# Остановка
docker-compose down
```

### 4. Запуск без Docker

```bash
# Установка зависимостей
npm install

# Запуск PostgreSQL (убедитесь, что PostgreSQL запущен)

# Запуск миграций (если есть)
npm run migration:run

# Запуск сидеров
npm run seed

# Запуск в development режиме
npm run start:dev
```

## API Документация

После запуска приложения, Swagger документация доступна по адресу:

**http://localhost:3000/api/docs**

### Основные эндпоинты

#### Пользователи

- `GET /api/v1/users` - Получить всех пользователей
- `POST /api/v1/users` - Создать пользователя
- `GET /api/v1/users/:id` - Получить пользователя по ID
- `GET /api/v1/users/email/:email` - Получить пользователя по email
- `GET /api/v1/users/login/:login` - Получить пользователя по login
- `PATCH /api/v1/users/:id` - Обновить пользователя
- `PATCH /api/v1/users/:id/status` - Обновить статус пользователя
- `DELETE /api/v1/users/:id` - Удалить пользователя
- `POST /api/v1/users/:id/avatar` - Загрузить аватар

#### Системные

- `GET /api/v1/health` - Проверка состояния приложения

## Тестирование

```bash
# Запуск unit тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:cov

# Запуск e2e тестов
npm run test:e2e
```

## Разработка

### Доступные команды

```bash
# Разработка
npm run start:dev      # Запуск в development режиме
npm run start:debug    # Запуск в debug режиме

# Сборка
npm run build          # Сборка проекта
npm run start:prod     # Запуск production версии

# Линтинг и форматирование
npm run lint           # ESLint проверка
npm run format         # Prettier форматирование

# База данных
npm run migration:generate  # Генерация миграции
npm run migration:run       # Запуск миграций
npm run migration:revert    # Откат миграции
npm run seed               # Запуск сидеров
```

### Структура пользователя

```typescript
interface User {
  id: string; // UUID
  login: string; // Уникальный логин
  firstName: string; // Имя
  lastName: string; // Фамилия
  middleName?: string; // Отчество (опционально)
  gender: 'male' | 'female';
  age: number; // Возраст
  phone?: string; // Телефон (опционально)
  email: string; // Уникальный email
  avatar?: string; // Путь к аватару (опционально)
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date; // Дата создания
  updatedAt: Date; // Дата обновления
}
```

## Конфигурация

### Docker Compose

Проект включает два сервиса:

- **postgres**: PostgreSQL 15 с данными в volume
- **api**: NestJS приложение

### Переменные окружения

| Переменная       | Описание         | По умолчанию  |
| ---------------- | ---------------- | ------------- |
| `DB_HOST`        | Хост базы данных | localhost     |
| `DB_PORT`        | Порт базы данных | 5432          |
| `DB_USERNAME`    | Пользователь БД  | postgres      |
| `DB_PASSWORD`    | Пароль БД        | password      |
| `DB_DATABASE`    | Имя БД           | komfortel_api |
| `PORT`           | Порт приложения  | 3000          |
| `NODE_ENV`       | Окружение        | development   |
| `JWT_SECRET`     | Секрет для JWT   | -             |
| `JWT_EXPIRES_IN` | Время жизни JWT  | 24h           |

## Production

### Docker Production

```bash
# Сборка production образа
docker build -t komfortel-api .

# Запуск с production переменными
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  komfortel-api
```

## Автор

**Nikita Arefyev**

---
