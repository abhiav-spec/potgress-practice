# Relational Query Project

## Introduction
This project is a Node.js + Express backend that demonstrates how to work with relational data in PostgreSQL using the `pg` library.

The code currently focuses on two related tables:
- `users`
- `address`

It shows how to:
- Insert related records safely using database transactions (`BEGIN`, `COMMIT`, `ROLLBACK`)
- Query relational data using SQL joins
- Build API endpoints to write and read relational data

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Current API Endpoints](#current-api-endpoints)
4. [Database Schema for This Project](#database-schema-for-this-project)
5. [Understanding Relational Queries](#understanding-relational-queries)
6. [Transactions in PostgreSQL](#transactions-in-postgresql)
7. [Joins and Types of Joins](#joins-and-types-of-joins)
8. [Join Examples with Sample Tables and Data](#join-examples-with-sample-tables-and-data)
9. [Backend Code Walkthrough](#backend-code-walkthrough)
10. [How to Run the Project](#how-to-run-the-project)
11. [How to Test APIs](#how-to-test-apis)
12. [Important Notes and Improvements](#important-notes-and-improvements)

## Project Overview
This backend handles user signup in two steps:
1. Insert user details into the `users` table
2. Insert the user address into the `address` table

Both steps are done inside one transaction so partial writes do not happen.

A GET endpoint then fetches user + address data using a join query.

## Tech Stack
- Node.js (ES Modules)
- Express
- PostgreSQL
- `pg` package (`Pool`)

## Current API Endpoints
### `POST /signup`
Creates a user and address using a transaction.

Expected JSON body:
```json
{
  "username": "Aarav",
  "email": "aarav@example.com",
  "password": "Aarav@123",
  "city": "Mumbai",
  "country": "India",
  "street": "Bandra West",
  "pincode": "400050"
}
```

### `GET /users?id=<userId>`
Fetches joined user and address details by user ID.

Example:
```bash
curl "http://localhost:3000/users?id=8"
```

## Database Schema for This Project
Use these SQL statements to create the required tables.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

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

## Understanding Relational Queries
A relational query is used when data is spread across multiple related tables.

In this project:
- `users.id` is the parent key
- `address.user_id` is the child foreign key

Relation:
- One user can have one (or more) address rows depending on your business rule.

Basic relational query pattern:
```sql
SELECT u.username, u.email, a.city
FROM users u
JOIN address a ON u.id = a.user_id
WHERE u.id = 8;
```

## Transactions in PostgreSQL
A transaction groups multiple SQL operations into one logical unit.

If all operations succeed:
- `COMMIT` saves all changes

If any operation fails:
- `ROLLBACK` cancels all changes

This is critical for multi-table writes.

### Why transaction is needed in this project
Without a transaction, this failure can happen:
1. User inserted in `users`
2. Address insert fails
3. Result: inconsistent database (user exists without expected address)

With transaction:
- Either both inserts succeed
- Or both are undone

### SQL transaction example
```sql
BEGIN;

INSERT INTO users (username, email, password)
VALUES ('Riya', 'riya@example.com', 'Riya@123')
RETURNING id;

-- Suppose returned id is 20
INSERT INTO address (user_id, city, country, street, pincode)
VALUES (20, 'Delhi', 'India', 'Connaught Place', '110001');

COMMIT;
```

If any query fails:
```sql
ROLLBACK;
```

### Node.js transaction pattern used
```js
const client = await db.connect();
try {
  await client.query("BEGIN");
  // insert query 1
  // insert query 2
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
} finally {
  client.release();
}
```

## Joins and Types of Joins
Joins combine rows from two or more tables using a relationship condition.

In this project, the main relationship is:
- `users.id` -> `address.user_id`

In SQL terms:
- `users` is often the parent table
- `address` is the child table

### Join Syntax Template
```sql
SELECT <columns>
FROM table_a a
<JOIN_TYPE> table_b b ON a.key = b.key;
```

### 1) INNER JOIN (only matching rows)
Definition:
- Returns rows where the join condition matches in both tables.
- Non-matching rows from either table are excluded.

Example:
```sql
SELECT u.id, u.username, a.city
FROM users u
INNER JOIN address a ON u.id = a.user_id;
```

When to use:
- You need only complete relational records.
- Example: show users only if an address exists.

### 2) LEFT JOIN (all rows from left table)
Definition:
- Returns all rows from left table.
- Matching rows from right table are included.
- If no match exists on right side, right columns are `NULL`.

Example:
```sql
SELECT u.id, u.username, a.city
FROM users u
LEFT JOIN address a ON u.id = a.user_id;
```

When to use:
- You want all users, even if some users do not have address records yet.

### 3) RIGHT JOIN (all rows from right table)
Definition:
- Returns all rows from right table.
- Matching rows from left table are included.
- If no match exists on left side, left columns are `NULL`.

Example:
```sql
SELECT u.id, u.username, a.city
FROM users u
RIGHT JOIN address a ON u.id = a.user_id;
```

When to use:
- You want to preserve all rows of right table in result.
- Practical note: many teams rewrite RIGHT JOIN as LEFT JOIN for readability.

Equivalent rewrite:
```sql
SELECT u.id, u.username, a.city
FROM address a
LEFT JOIN users u ON u.id = a.user_id;
```

### 4) FULL OUTER JOIN (all rows from both tables)
Definition:
- Returns all rows from both tables.
- Matching rows are merged.
- Non-matching rows from either side appear with `NULL` for missing side.

Example:
```sql
SELECT u.id, u.username, a.city, a.user_id
FROM users u
FULL OUTER JOIN address a ON u.id = a.user_id;
```

When to use:
- Audits, reconciliation, and data-quality checks.

## Join Examples with Sample Tables and Data
The following detailed sample shows exactly how each join behaves.

### 1) Create example tables
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER,
  score INTEGER
);
```

### 2) Insert example data
```sql
INSERT INTO students (id, name) VALUES
(1, 'Aman'),
(2, 'Bhavna'),
(3, 'Chetan');

INSERT INTO marks (id, student_id, score) VALUES
(1, 1, 85),
(2, 2, 91),
(3, 4, 70);
```

Interpretation of data:
- `student_id = 1` and `2` in marks have matching students.
- `student_id = 4` in marks has no matching student.
- Student `id = 3` has no matching marks row.

### 3) INNER JOIN detailed example
Query:
```sql
SELECT s.id AS student_id, s.name, m.score
FROM students s
INNER JOIN marks m ON s.id = m.student_id
ORDER BY s.id;
```

Expected output:
```text
student_id | name   | score
-----------+--------+------
1          | Aman   | 85
2          | Bhavna | 91
```

Why:
- Only matched pairs survive.

### 4) LEFT JOIN detailed example
Query:
```sql
SELECT s.id AS student_id, s.name, m.score
FROM students s
LEFT JOIN marks m ON s.id = m.student_id
ORDER BY s.id;
```

Expected output:
```text
student_id | name   | score
-----------+--------+------
1          | Aman   | 85
2          | Bhavna | 91
3          | Chetan | NULL
```

Why:
- All rows from students are preserved.
- Chetan has no marks, so score is NULL.

### 5) RIGHT JOIN detailed example
Query:
```sql
SELECT s.id AS student_id, s.name, m.student_id AS marks_student_id, m.score
FROM students s
RIGHT JOIN marks m ON s.id = m.student_id
ORDER BY m.id;
```

Expected output:
```text
student_id | name   | marks_student_id | score
-----------+--------+------------------+------
1          | Aman   | 1                | 85
2          | Bhavna | 2                | 91
NULL       | NULL   | 4                | 70
```

Why:
- All rows from marks are preserved.
- The row with `student_id = 4` has no matching student.

### 6) FULL OUTER JOIN detailed example
Query:
```sql
SELECT s.id AS student_id, s.name, m.student_id AS marks_student_id, m.score
FROM students s
FULL OUTER JOIN marks m ON s.id = m.student_id
ORDER BY COALESCE(s.id, m.student_id);
```

Expected output:
```text
student_id | name   | marks_student_id | score
-----------+--------+------------------+------
1          | Aman   | 1                | 85
2          | Bhavna | 2                | 91
3          | Chetan | NULL             | NULL
NULL       | NULL   | 4                | 70
```

Why:
- Includes every row from both tables.
- Unmatched side appears as NULL.

### 7) Practical join pattern used in this project
Current API query uses an INNER JOIN:
```sql
SELECT u.username, u.email, a.city, a.country, a.street, a.pincode
FROM users u
JOIN address a ON u.id = a.user_id
WHERE u.id = $1;
```

If you want users without address also, use LEFT JOIN instead:
```sql
SELECT u.username, u.email, a.city, a.country, a.street, a.pincode
FROM users u
LEFT JOIN address a ON u.id = a.user_id
WHERE u.id = $1;
```

## Complete Join Lab Using Project Tables
This section gives a complete example using `users` and `address` tables only.

### 1) Create tables
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE address (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  city VARCHAR(100),
  country VARCHAR(100),
  street VARCHAR(255),
  pincode VARCHAR(20)
);
```

### 2) Insert sample data
```sql
INSERT INTO users (id, username, email) VALUES
(1, 'Aarav', 'aarav@example.com'),
(2, 'Meera', 'meera@example.com'),
(3, 'Rohan', 'rohan@example.com');

INSERT INTO address (id, user_id, city, country, street, pincode) VALUES
(1, 1, 'Mumbai', 'India', 'Bandra West', '400050'),
(2, 2, 'Delhi', 'India', 'CP', '110001'),
(3, 5, 'Pune', 'India', 'FC Road', '411001');
```

Data behavior in this setup:
- User `id = 3` has no address.
- Address row with `user_id = 5` has no matching user.

### 3) INNER JOIN query
```sql
SELECT u.id, u.username, a.city
FROM users u
INNER JOIN address a ON u.id = a.user_id
ORDER BY u.id;
```

Result idea:
- Returns only users 1 and 2 with their cities.
- User 3 is excluded.
- Orphan address (`user_id = 5`) is excluded.

### 4) LEFT JOIN query
```sql
SELECT u.id, u.username, a.city
FROM users u
LEFT JOIN address a ON u.id = a.user_id
ORDER BY u.id;
```

Result idea:
- Returns users 1, 2, and 3.
- User 3 appears with `city = NULL`.

### 5) RIGHT JOIN query
```sql
SELECT u.id, u.username, a.user_id, a.city
FROM users u
RIGHT JOIN address a ON u.id = a.user_id
ORDER BY a.id;
```

Result idea:
- Returns all address rows.
- The row with `user_id = 5` appears with `u.id` and `u.username` as `NULL`.

### 6) FULL OUTER JOIN query
```sql
SELECT u.id, u.username, a.user_id, a.city
FROM users u
FULL OUTER JOIN address a ON u.id = a.user_id
ORDER BY COALESCE(u.id, a.user_id);
```

Result idea:
- Includes all users and all address rows.
- User 3 appears even without address.
- Address with `user_id = 5` appears even without user.

### 7) Filtered query example used in API
```sql
SELECT u.username, u.email, a.city, a.country, a.street, a.pincode
FROM users u
JOIN address a ON u.id = a.user_id
WHERE u.id = 1;
```

This is the same join pattern your `GET /users?id=<id>` endpoint is using.

## Backend Code Walkthrough
This project uses `Pool` for database connections and manual transaction handling.

### 1) Database pool creation
```js
const db = new Pool({
  user: "...",
  host: "...",
  database: "...",
  password: "...",
  port: 5432,
  ssl: true
});
```

### 2) POST signup with transaction
```js
app.post("/signup", async (req, res) => {
  const client = await db.connect();
  try {
    const { username, password, email } = req.body;
    const { city, country, street, picode, pincode } = req.body;
    const pin = pincode ?? picode;

    await client.query("BEGIN");

    const response = await client.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id",
      [username, password, email]
    );

    const userId = response.rows[0].id;

    await client.query(
      "INSERT INTO address (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5)",
      [userId, city, country, street, pin]
    );

    await client.query("COMMIT");
    res.json({ message: "User signed up successfully", user: response.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to sign up user" });
  } finally {
    client.release();
  }
});
```

### 3) GET user using join
```js
app.get("/users", async (req, res) => {
  const id = req.query.id;
  const query = `
    SELECT u.username, u.email, a.city, a.country, a.street, a.pincode
    FROM users u JOIN address a ON u.id = a.user_id
    WHERE u.id = $1
  `;

  const response = await db.query(query, [id]);
  res.json(response.rows[0]);
});
```

## How to Run the Project
Install dependencies:

```bash
npm install
```

Run server:

```bash
node index.js
```

Server URL:
- `http://localhost:3000`

## How to Test APIs
### Test signup
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username":"Riya",
    "email":"riya@example.com",
    "password":"Riya@123",
    "city":"Delhi",
    "country":"India",
    "street":"Connaught Place",
    "pincode":"110001"
  }'
```

### Test get user by id
```bash
curl "http://localhost:3000/users?id=8"
```

## Important Notes and Improvements
1. Move DB credentials to environment variables (`.env`) before sharing or deploying.
2. Add validation for required fields in `/signup`.
3. Hash passwords before storing (for example with `bcrypt`).
4. Add indexes:
   - `users(email)` (unique)
   - `address(user_id)`
5. Add a script in `package.json` such as:
   - `"dev": "nodemon index.js"`
6. Consider adding separate endpoint naming for clarity:
   - `/users/:id`
