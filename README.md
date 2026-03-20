# E-Commerce Backend API (User & Authentication Module)

Backend API developed using a layered architecture, focused on separation of responsibilities and testability.

Implements a complete user management and authentication module based on secure credential verification, built with TypeScript and Prisma ORM on top of PostgreSQL.

---

## Architecture

The application follows a modular approach based on MVC + service layer:

server/
app/
routes/
controllers/
services/
middlewares/

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

The login endpoint properly validates credentials and is prepared to evolve into JWT-based authentication.

---

## Implemented Features

### Users CRUD

- Create user
- Get all users
- Get user by ID
- Update user
- Delete user

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

```

### Install dependencies

npm install

### Enviroment configuration

copy the .env.example file and set your local credentials (dataBaseUrl, secret key, etc)

### Database setup

run the migrations to create tables in your database

npx prisma migrate dev --name init
npx prisma db seed

### Run your project

# Development mode

npm run dev

# Production build

npm run build
npm start

# Testing

npm test
