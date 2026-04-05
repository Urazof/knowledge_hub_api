# Nest.js Knowledge Hub API

REST API для платформы знаний на Nest.js.

## Возможности
- CRUD для `User`, `Article`, `Category`, `Comment`
- DTO-валидация всех request body (`class-validator` + глобальный `ValidationPipe`)
- Фильтрация статей: `status`, `categoryId`, `tag`
- Swagger/OpenAPI документация: `GET /doc`
- Каскадные удаления:
  - удаление `User` -> `authorId` у статей становится `null`, комментарии пользователя удаляются
  - удаление `Category` -> `categoryId` у статей становится `null`
  - удаление `Article` -> комментарии статьи удаляются
- Пагинация и сортировка list-endpoint-ов

## Требования
- Node.js `24.10.0+`
- npm

## Установка
```bash
npm install
```

## Конфигурация
1. Создайте `.env` (или используйте существующий):
```dotenv
PORT=4000
```
2. В репозитории есть шаблон: `.env.example`.

## Запуск
```bash
npm start
```

По умолчанию сервер запускается на `http://localhost:4000`.

## Swagger
После запуска откройте:
- `http://localhost:4000/doc`

## Скрипты
```bash
npm run build
npm run lint
npm start
npm run start:prod
npm run test:extra
npm run test:spec
npm run test
```

## API overview

### User (`/user`)
- `GET /user`
- `GET /user/:id`
- `POST /user`
- `PUT /user/:id` (смена пароля)
- `DELETE /user/:id`

### Article (`/article`)
- `GET /article`
- `GET /article/:id`
- `POST /article`
- `PUT /article/:id`
- `DELETE /article/:id`

Фильтры:
- `status` (`draft|published|archived`)
- `categoryId` (UUID)
- `tag` (точное совпадение)

### Category (`/category`)
- `GET /category`
- `GET /category/:id`
- `POST /category`
- `PUT /category/:id`
- `DELETE /category/:id`

### Comment (`/comment`)
- `GET /comment?articleId=<uuid>`
- `POST /comment`
- `DELETE /comment/:id`

## Пагинация и сортировка
Для list-endpoint-ов поддерживаются query-параметры:
- `page` (>=1)
- `limit` (>=1)
- `sortBy`
- `order` (`asc|desc`)

Поведение ответа:
- без `page/limit` -> обычный массив
- с `page/limit` -> объект:
```json
{
  "total": 100,
  "page": 1,
  "limit": 10,
  "data": []
}
```

## Примеры запросов (PowerShell)

Создать пользователя:
```powershell
Invoke-RestMethod -Uri http://localhost:4000/user -Method Post -ContentType "application/json" -Body '{"login":"alex","password":"12345"}'
```

Создать категорию:
```powershell
Invoke-RestMethod -Uri http://localhost:4000/category -Method Post -ContentType "application/json" -Body '{"name":"Backend","description":"Backend articles"}'
```

Создать статью:
```powershell
Invoke-RestMethod -Uri http://localhost:4000/article -Method Post -ContentType "application/json" -Body '{"title":"Nest intro","content":"...","status":"published","tags":["nestjs","api"]}'
```

Фильтрация + пагинация + сортировка статей:
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/article?status=published&tag=nestjs&page=1&limit=5&sortBy=title&order=asc" -Method Get
```

Получить комментарии по статье:
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/comment?articleId=<ARTICLE_UUID>" -Method Get
```

## Коды ответов (основные)
- `200` — успешный `GET/PUT`
- `201` — успешный `POST`
- `204` — успешный `DELETE`
- `400` — невалидный UUID/тело/параметры
- `403` — неверный `oldPassword`
- `404` — сущность не найдена
- `422` — `articleId` не существует при создании комментария
