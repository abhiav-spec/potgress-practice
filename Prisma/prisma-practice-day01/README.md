# Prisma Practice - Day 01

## Introduction
This project is a hands-on exploration of **Prisma ORM** integrated with **Express.js** and **PostgreSQL**. The goal of this "Day 01" practice is to understand basic schema modeling, relational data structures (one-to-many), and performing CRUD operations using the generated Prisma Client.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Database Schema (Prisma)](#database-schema-prisma)
4. [Core Features & Examples](#core-features--examples)
   - [User Management](#user-management)
   - [Todo Management (Relational)](#todo-management-relational)
5. [Prisma Workflow](#prisma-workflow)
6. [API Reference](#api-reference)
7. [Installation & Setup](#installation--setup)
8. [Testing Guide](#testing-guide)

---

## Technology Stack
- **ORM**: Prisma (v5.x+)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (Hosted on Neon)
- **Tooling**: `dotenv`, `nodemon`

---

## Project Architecture
- `prisma/schema.prisma`: The source of truth for the database schema and models.
- `index.js`: Express server with API endpoints leveraging Prisma Client.
- `.env`: Environment variables for database connection strings.
- `package.json`: Project scripts and dependencies.

---

## Database Schema (Prisma)
The schema defines a **One-to-Many** relationship where a `User` can have multiple `Todos`.

### 1. User Model
```prisma
model User {
    id        Int      @id @default(autoincrement())
    name      String
    email     String   @unique
    city      String 
    password  String
    todos     Todo[]
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

### 2. Todo Model
```prisma
model Todo {
    id          Int      @id @default(autoincrement())
    title       String
    description String
    userId      Int
    user        User     @relation(fields: [userId], references: [id])
    isCompleted Boolean  @default(false)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
}
```

---

## Core Features & Examples

### User Management
The project allows creating users and storing them in the PostgreSQL database.

**Example: Creating a User via Prisma Client**
```javascript
const user = await prisma.user.create({
    data: {
        name: "John Doe",
        email: "john@example.com",
        city: "New York",
        password: "securepassword",
    },
});
```

### Todo Management (Relational)
Todos are linked to users via the `userId` foreign key.

**Example: Creating a Todo for a specific User**
```javascript
const todo = await prisma.todo.create({
    data: {
        title: "Buy Milk",
        description: "Need to buy milk from the store",
        userId: parseInt(userId),
    },
});
```

---

## Prisma Workflow
To keep the project in sync with the database, follow these steps:

1. **Update Schema**: Modify `prisma/schema.prisma`.
2. **Migrate Database**:
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Generate Client**:
   ```bash
   npx prisma generate
   ```

---

## API Reference

### User Endpoints
- **POST `/create-user`**: Creates a new user.
  - Body: `{ "name", "email", "city", "password" }`

### Todo Endpoints
- **POST `/api/create-todo/:userId`**: Creates a todo for the specified user.
  - Body: `{ "title", "description" }`
- **GET `/api/todos/:userId`**: Fetches all todos belonging to the specified user.

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhiav-spec/potgress-practice.git
   cd Prisma/prisma-practice-day01
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root and add your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
   DIRECT_URL="postgresql://user:password@host:port/dbname?sslmode=require"
   ```

4. **Initialize Prisma**:
   ```bash
   npx prisma generate
   ```

5. **Start the server**:
   ```bash
   npm start
   # OR
   nodemon index.js
   ```

---

## Testing Guide

### 1. Create a User
```bash
curl -X POST http://localhost:3000/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "city": "London",
    "password": "password123"
  }'
```

### 2. Create a Todo for User ID 1
```bash
curl -X POST http://localhost:3000/api/create-todo/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Prisma Tutorial",
    "description": "Go through the official documentation"
  }'
```

### 3. Fetch Todos for User ID 1
```bash
curl http://localhost:3000/api/todos/1
```

---

Developed by [Abhinav Mishra](https://github.com/abhiav-spec)
