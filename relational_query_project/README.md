# Relational Query Project

## Introduction
This project is a comprehensive Node.js and Express application designed to demonstrate the power and reliability of relational database management using **PostgreSQL**. Hosted on **Neon**, it focuses on two critical backend engineering concepts: **Transactions** and **SQL Joins**.

The application manages user accounts and their associated addresses across separate tables, ensuring data integrity through ACID-compliant transactions and reconstructing complex entities using efficient SQL joins.

---

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Database Schema](#database-schema)
4. [Core Features & Examples](#core-features--examples)
   - [Atomic Transactions (Signup Flow)](#atomic-transactions-signup-flow)
   - [Relational Joins (User Lookup)](#relational-joins-user-lookup)
5. [Deep Dive into SQL Joins](#deep-dive-into-sql-joins)
   - [INNER JOIN](#inner-join)
   - [LEFT JOIN](#left-join)
   - [RIGHT JOIN](#right-join)
   - [FULL OUTER JOIN](#full-outer-join)
6. [API Reference](#api-reference)
7. [Installation & Setup](#installation--setup)
8. [Testing Guide](#testing-guide)
9. [Future Improvements](#future-improvements)

---

## Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5.x)
- **Database**: PostgreSQL (Hosted on Neon)
- **Driver**: `pg` (Node-Postgres)
- **Environment**: ES Modules (`type: "module"`)

---

## Project Architecture
- `index.js`: The entry point of the application. Handles server initialization, database pool management, and API routing.
- `package.json`: Manages dependencies and project metadata.
- `README.md`: Comprehensive documentation (this file).

---

## Database Schema
The project utilizes a one-to-one (or one-to-many) relationship between `users` and `address`.

### 1. Users Table
Stores core account credentials.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Address Table
Stores location details linked to a specific user.
```sql
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city VARCHAR(100),
    country VARCHAR(100),
    street VARCHAR(255),
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Core Features & Examples

### Atomic Transactions (Signup Flow)
When a user signs up, we need to insert data into *two* different tables. If the user is created but the address fails, we end up with "orphan" records. This project uses **Transactions** to ensure "all or nothing" execution.

**Example Logic in `index.js`:**
```javascript
await client.query("BEGIN"); // Start Transaction

const userResponse = await client.query(
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id",
    [username, password, email]
);

const userId = userResponse.rows[0].id;

await client.query(
    "INSERT INTO address (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5)",
    [userId, city, country, street, pin]
);

await client.query("COMMIT"); // Save all changes
```

### Relational Joins (User Lookup)
Instead of making multiple requests to get user and address details, we use a **SQL JOIN** to fetch everything in one go.

**Example Query:**
```sql
SELECT u.username, u.email, a.city, a.country, a.street, a.pincode
FROM users u 
JOIN address a ON u.id = a.user_id
WHERE u.id = $1;
```

---

## Deep Dive into SQL Joins

### 1. INNER JOIN
Returns records that have matching values in both tables.
- **Used in API**: `GET /users?id=...`
- **Behavior**: If a user exists but has no address, they won't appear in the results.

### 2. LEFT JOIN
Returns all records from the left table (`users`), and the matched records from the right table (`address`).
- **Use Case**: Get all users even if they haven't filled in their address yet.
- **Example**:
  ```sql
  SELECT u.username, a.city FROM users u LEFT JOIN address a ON u.id = a.user_id;
  ```

### 3. RIGHT JOIN
Returns all records from the right table (`address`), and the matched records from the left table (`users`).
- **Use Case**: Identify addresses that might not be linked to a valid user (orphans).

### 4. FULL OUTER JOIN
Returns all records when there is a match in either left or right table records.
- **Use Case**: Database auditing and synchronization.

---

## API Reference

### POST `/signup`
Registers a new user and their address atomically.
- **Payload**:
  ```json
  {
    "username": "JohnDoe",
    "email": "john@example.com",
    "password": "securepassword",
    "city": "New York",
    "country": "USA",
    "street": "5th Ave",
    "pincode": "10001"
  }
  ```
- **Note**: Supports both `pincode` and `picode` fields as a fallback mechanism.

### GET `/users`
Fetches combined user and address data via ID.
- **Query Param**: `id` (e.g., `/users?id=10`)
- **Response**: Combined JSON object containing fields from both tables.

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhiav-spec/potgress-practice.git
   cd relational_query_project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Database**:
   Update the `db` pool configuration in `index.js` with your Neon connection string.

4. **Run the server**:
   ```bash
   node index.js
   ```

---

## Testing Guide

### Test User Creation (POST)
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username":"Alice",
    "email":"alice@example.com",
    "password":"password123",
    "city":"San Francisco",
    "country":"USA",
    "street":"Market St",
    "pincode":"94103"
  }'
```

### Test User Fetching (GET)
```bash
curl "http://localhost:3000/users?id=1"
```

---

## Future Improvements
- [ ] Implement `.env` for sensitive database credentials.
- [ ] Add Request Validation (e.g., using Zod or Joi).
- [ ] Password hashing with `bcrypt`.
- [ ] Implement JWT authentication.
- [ ] Convert query params to RESTful URL params (`/users/:id`).

---

Developed by [Abhinav Mishra](https://github.com/abhiav-spec)
