# Bible Manager API

A production-grade REST API for managing Bible translations, books, chapters, and verses. Built with NestJS, Prisma, and SQLite (with easy PostgreSQL migration).

## Features

✅ **Production-Ready**
- Full CRUD operations for translations, books, chapters, and verses
- Comprehensive input validation with class-validator
- Pagination support for large datasets
- Global error handling with consistent error responses
- Transaction support for bulk operations

✅ **Developer Experience**
- API versioning (`/api/v1`)
- Interactive Swagger/OpenAPI documentation
- Type-safe database access with Prisma
- Environment-based configuration
- Database seeding with sample data

✅ **Database**
- SQLite for development (file-based, zero configuration)
- Easy migration path to PostgreSQL for production
- Optimized indexes and constraints
- Cascading deletes for referential integrity

## Tech Stack

- **Framework**: NestJS 10.x
- **Database ORM**: Prisma 7.x
- **Database**: SQLite (PostgreSQL-ready)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript 5.x

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn (or npm)

### Installation

1. **Clone and install dependencies**

```bash
# Install dependencies
yarn install
```

2. **Set up environment variables**

The `.env` file should already exist with:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
API_VERSION=v1
```

3. **Generate Prisma Client and run migrations**

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

4. **Start the development server**

```bash
yarn start:dev
```

The API will be available at:
- **API Base**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs

## API Documentation

### Base URL

All endpoints are prefixed with `/api/v1`

### Swagger UI

Interactive API documentation is available at http://localhost:3000/api/docs

### Endpoints Overview

#### Translations

- `GET /api/v1/translations?page=1&limit=20` - List all translations (paginated)
- `GET /api/v1/translations/:id` - Get a specific translation
- `POST /api/v1/translations` - Create a new translation
- `PATCH /api/v1/translations/:id` - Update a translation
- `DELETE /api/v1/translations/:id` - Delete a translation

#### Books

- `GET /api/v1/books?translationId=1&page=1&limit=20` - List books (with optional translation filter)
- `GET /api/v1/books/:id` - Get a specific book
- `POST /api/v1/books` - Create a new book
- `PATCH /api/v1/books/:id` - Update a book
- `DELETE /api/v1/books/:id` - Delete a book

#### Chapters

- `GET /api/v1/chapters?bookId=1&page=1&limit=50` - List chapters (with optional book filter)
- `GET /api/v1/chapters/:id` - Get a specific chapter
- `POST /api/v1/chapters` - Create a new chapter
- `PATCH /api/v1/chapters/:id` - Update a chapter
- `DELETE /api/v1/chapters/:id` - Delete a chapter

#### Verses

- `GET /api/v1/verses?chapterId=1&page=1&limit=50` - List verses (with optional chapter filter)
- `GET /api/v1/verses/:id` - Get a specific verse
- `POST /api/v1/verses` - Create a single verse
- `POST /api/v1/verses/bulk` - Create multiple verses in one transaction
- `PATCH /api/v1/verses/:id` - Update a verse
- `DELETE /api/v1/verses/:id` - Delete a verse

### Example Requests

#### Create a Translation

```bash
curl -X POST http://localhost:3000/api/v1/translations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New International Version",
    "abbreviation": "NIV",
    "language": "English",
    "description": "A modern English translation"
  }'
```

#### Create a Book

```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Exodus",
    "abbreviation": "Exo",
    "bookNumber": 2,
    "testament": "OT",
    "translationId": 1
  }'
```

#### Create Bulk Verses

```bash
curl -X POST http://localhost:3000/api/v1/verses/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": 1,
    "verses": [
      {
        "verseNumber": 11,
        "text": "And God said, Let the earth bring forth grass..."
      },
      {
        "verseNumber": 12,
        "text": "And the earth brought forth grass..."
      }
    ]
  }'
```

#### Get Verses with Pagination

```bash
curl "http://localhost:3000/api/v1/verses?chapterId=1&page=1&limit=10"
```

### Response Format

#### Success Response (Single Item)

```json
{
  "id": 1,
  "name": "King James Version",
  "abbreviation": "KJV",
  "language": "English",
  "description": "Published in 1611...",
  "createdAt": "2026-01-05T12:00:00.000Z",
  "updatedAt": "2026-01-05T12:00:00.000Z"
}
```

#### Success Response (Paginated)

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Error Response

```json
{
  "statusCode": 404,
  "message": "Translation with ID 999 not found",
  "timestamp": "2026-01-05T12:00:00.000Z",
  "path": "/api/v1/translations/999"
}
```

## Database Schema

```
BibleTranslation (1) ──< (N) Book (1) ──< (N) Chapter (1) ──< (N) Verse
```

### Models

- **BibleTranslation**: Different Bible versions (KJV, NIV, ESV, etc.)
- **Book**: 66 books of the Bible (Genesis, Exodus, Matthew, etc.)
- **Chapter**: Chapters within each book
- **Verse**: Individual verses with text content

## Database Management

### View Database

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio
```

### Reset Database

```bash
# Reset and re-seed
npx prisma migrate reset
```

### Create New Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name description_of_changes
```

## Migration to PostgreSQL

When ready to switch from SQLite to PostgreSQL:

### 1. Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
}
```

### 2. Update Database URL

Edit `prisma.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  datasource: {
    url: "postgresql://user:password@localhost:5432/bible_db?schema=public",
  },
});
```

Or update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bible_db?schema=public"
```

### 3. Run Migration

```bash
npx prisma migrate dev --name switch_to_postgresql
npx prisma db seed
```

**Note**: No code changes required! Prisma abstracts database differences.

## Development

### Available Scripts

```bash
# Development
yarn start:dev          # Start with hot-reload

# Production
yarn build              # Build for production
yarn start:prod         # Run production build

# Testing
yarn test               # Run unit tests
yarn test:e2e          # Run end-to-end tests
yarn test:cov          # Run tests with coverage

# Linting & Formatting
yarn lint              # Run ESLint
yarn format            # Format code with Prettier
```

### Project Structure

```
src/
├── common/                 # Shared utilities
│   ├── dto/               # Pagination DTOs
│   ├── filters/           # Exception filters
│   └── interceptors/      # Response transformers
├── config/                # Configuration
├── prisma/                # Prisma service & module
├── translation/           # Translation module
├── book/                  # Book module
├── chapter/               # Chapter module
├── verse/                 # Verse module
├── app.module.ts         # Root module
└── main.ts               # Application entry point

prisma/
├── schema.prisma         # Database schema
├── seed.ts              # Seed script
└── migrations/          # Migration history
```

## Validation Rules

### Translation
- `name`: Required, unique
- `abbreviation`: Required, unique, 2-10 characters
- `language`: Required
- `description`: Optional

### Book
- `name`: Required
- `abbreviation`: Required
- `bookNumber`: Required, 1-66
- `testament`: Required, must be 'OT' or 'NT'
- `translationId`: Required, must exist

### Chapter
- `chapterNumber`: Required, >= 1
- `bookId`: Required, must exist
- Unique per book

### Verse
- `verseNumber`: Required, >= 1
- `text`: Required, max 1000 characters
- `chapterId`: Required, must exist
- Unique per chapter

## Sample Data

The seed script creates:
- 1 KJV translation
- Genesis book (book 1)
- Genesis Chapter 1
- First 10 verses of Genesis 1

Access via: `GET /api/v1/verses?chapterId=1`

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

- `400` - Bad Request (validation errors, missing required fields)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate entries, unique constraint violations)
- `500` - Internal Server Error (unexpected errors)

## License

UNLICENSED

## Support

For questions or issues, please check the [NestJS Documentation](https://docs.nestjs.com) and [Prisma Documentation](https://www.prisma.io/docs).
