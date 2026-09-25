# E-Commerce Backend API

Backend API developed using a layered architecture, focused on separation of responsibilities and testability.

Implements a complete user management and authentication module based on secure credential verification, built with TypeScript and Prisma ORM on top of PostgreSQL.

Docker implemented for best dev ops practices

---

## Architecture

The application follows a modular approach based on MVC + service layer:

```text
src/
  ├── @types/
  ├── routes/
  ├── controllers/
  ├── services/
  ├── middlewares/
  ├── errors/
  ├── schemas/
  ├── app.ts
  └── server.ts
test/
```

### Principles

- Controllers (handle request/response exclusively)
- Business logic isolated in services
- Manual dependency injection (Prisma and bcrypt)
- Centralized error handling through a global middleware
- Custom error classes extending `Error`

---

## Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (data validation)
- Bcrypt (password hashing)
- Vitest (testing)
- JWT (sessions)

Infrastructure:

- Deployment on Railway
- Database hosted on Neon

---

## Security and Authentication

- Secure password hashing with bcrypt
- Safe credential verification using `compare()`
- Structured validation with Zod
- Unique email constraint
- Explicit exclusion of the `password` field in all responses (using Prisma `select`)
- Secure login authentication returning a signed JWT access token upon successful credential verification.

## Implemented Features

### Users CRUD

- Create user
- Get all users
- Get user by ID
- Update user
- Delete user

### Category CRUD

- Create category
- Get all categories
- Get category by ID
- Update category
- Delete category

### Product CRUD

- Create product
- Get all products
- Get product by ID
- Update product
- Delete product

### Login

- Credential validation
- Response without exposing sensitive data

---

## Testing

Testing is focused on the service layer using Vitest.

Includes:

- Positive cases
- Negative cases
- Verification of custom error throwing

Business logic is fully tested in isolation thanks to dependency decoupling.

---

## Deployment

The project is deployed and production-ready:

- Backend hosted on Railway
- PostgreSQL database on Neon
- Configurable environment variables
- Prisma seed script to initialize an admin user

---

## Installation and Usage

### Clone repository

```bash
git clone https://github.com/ReyOrdonez/backend-ECommerce.git
cd backend-ECommerce
```

### Install dependencies

```bash
npm install
```

### Enviroment configuration

copy the .env.example file and set your local credentials (dataBaseUrl, secret key, etc)

### Database setup

run the migrations to create tables in your database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Run your project

### Development mode

```bash
npm run dev
```

### or

```bash
docker compose -f docker-compose-dev.yml up
```

### Production build

```bash
npm run build
npm start
```

### or

```bash
docker compose up
```

### Testing

```bash
npm test
```
