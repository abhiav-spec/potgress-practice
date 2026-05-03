# Relational Query Project

## Introduction
This project is a small Node.js and Express backend that demonstrates how relational data works in PostgreSQL. It uses the `pg` package to connect to a Neon-hosted PostgreSQL database and shows two core ideas that come up in real backend work:

1. Writing related data safely across multiple tables.
2. Reading related data back with SQL joins.

The app centers around two tables:

- `users` stores account details such as username, email, and password.
- `address` stores the user’s location data and is linked to `users` through `user_id`.

This makes the project a good beginner example of relational database design because it shows how one logical entity can be split across multiple tables while still being treated as one workflow in the backend.

## What This Project Does
The current backend supports two main flows:

- It creates a user and the related address inside one transaction.
- It reads a user with their address using a join query.

That means the project is not just about CRUD endpoints. It is really about understanding how backend code, SQL, and database integrity work together.

## Tech Stack
- Node.js with ES Modules
- Express for routing and JSON handling
- PostgreSQL as the database
- `pg` for database access

## Project Structure
- `index.js` contains the Express server, database pool, transaction logic, and routes.
- `package.json` defines the project metadata and dependencies.
- `README.md` explains the database ideas, APIs, and learning outcomes.

## Database Design
The project uses a parent-child relationship between the tables.

- `users.id` is the primary key.
- `address.user_id` is a foreign key that points back to `users.id`.

This relationship means one user can have one related address row, or multiple if the business rules change later. For this project, the main idea is that address data belongs to a user.

Suggested schema:

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

## API Endpoints
### `POST /signup`
Creates a user and their address in one request.

Expected request body:

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

This endpoint is designed to demonstrate a multi-step write flow. First the user is inserted into `users`, then the returned user ID is used to insert the address into `address`.

### `GET /users?id=<userId>`
Fetches a user and their address using a join query.

Example:

```bash
curl "http://localhost:3000/users?id=8"
```

This endpoint shows the read side of relational data. Instead of making separate requests for user data and address data, the backend combines them into one query.

## How The Data Flow Works
The signup flow follows a safe pattern:

1. Accept user and address details from the request body.
2. Start a transaction with `BEGIN`.
3. Insert the user into `users`.
4. Read the new user ID from the insert result.
5. Insert the address into `address` using that ID.
6. Commit the transaction if both inserts succeed.
7. Roll back the transaction if anything fails.

This is the important idea in the project: the two inserts must behave like one operation.

## Why Transactions Matter
Without a transaction, a failure can leave the database in a broken state.

Example problem:

1. The user row is inserted successfully.
2. The address insert fails.
3. The database now contains a user without the matching address that the backend expected.

Transactions prevent that inconsistency. Either both inserts succeed, or both are undone.

SQL example:

```sql
BEGIN;

INSERT INTO users (username, email, password)
VALUES ('Riya', 'riya@example.com', 'Riya@123')
RETURNING id;

INSERT INTO address (user_id, city, country, street, pincode)
VALUES (20, 'Delhi', 'India', 'Connaught Place', '110001');

COMMIT;
```

If anything fails, the correct recovery action is:

```sql
ROLLBACK;
```

## Why Joins Matter
Joins let us read related data from multiple tables in one query.

The project uses the relationship:

- `users.id = address.user_id`

That means we can combine user data with address data directly in SQL instead of joining them manually in JavaScript.

Basic pattern:

```sql
SELECT u.username, u.email, a.city
FROM users u
JOIN address a ON u.id = a.user_id
WHERE u.id = 8;
```

The current API uses an `INNER JOIN`, which only returns rows where both sides match.

## Join Types Learned In This Project
This project was a useful way to learn the difference between common SQL joins.

### INNER JOIN
Returns only matching rows from both tables.

Use it when you want complete relational records and do not care about rows that are missing on either side.

### LEFT JOIN
Returns every row from the left table and matching rows from the right table.

Use it when you want all users, even if some users do not yet have address records.

### RIGHT JOIN
Returns every row from the right table and matching rows from the left table.

It is less commonly used, and many teams prefer rewriting it as a `LEFT JOIN` for readability.

### FULL OUTER JOIN
Returns every row from both tables, matched where possible.

Use it for auditing, reconciliation, or finding missing links between tables.

## Backend Walkthrough
### Database Connection
The app creates a PostgreSQL pool so it can reuse connections efficiently.

### Signup Route
The `/signup` route uses `express.json()` to parse the request body, then opens a client connection, starts a transaction, inserts the user, inserts the address, and commits if both succeed.

This route also shows one practical detail: the backend accepts both `pincode` and the misspelled `picode` field, then falls back to whichever one is present. That makes the handler a little more forgiving while testing.

### Users Lookup Route
The `/users` route reads the user ID from the query string and runs a join query to return the combined user and address data in a single response.

## Example Learning Query
One of the clearest things this project teaches is how joins change the result set.

```sql
SELECT u.username, u.email, a.city, a.country, a.street, a.pincode
FROM users u
JOIN address a ON u.id = a.user_id
WHERE u.id = $1;
```

This query is simple, but it captures a real backend pattern: one entity in the API is often composed from several tables behind the scenes.

## How To Run
Install dependencies:

```bash
npm install
```

Start the server:

```bash
node index.js
```

The app runs on:

- `http://localhost:3000`

## How To Test
### Create a user
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

### Fetch a user by ID
```bash
curl "http://localhost:3000/users?id=8"
```

## What We Learned
This project helped reinforce a few important backend concepts:

- Relational databases are built around links between tables, not just around separate records.
- Foreign keys are what make those links explicit and reliable.
- Transactions are essential whenever one request needs to update more than one table.
- `COMMIT` and `ROLLBACK` are the difference between consistent data and half-finished writes.
- Joins are the standard way to reconstruct related records when reading from the database.
- `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN` each answer a different data question.
- Parameterized queries are the correct way to pass user input into SQL safely.

## Future Improvements
If this project grows further, the next useful upgrades would be:

- Move database credentials into environment variables.
- Add validation for required request fields.
- Hash passwords before storing them.
- Add a `dev` script with nodemon for easier local development.
- Consider changing `/users?id=<id>` to `/users/:id` for cleaner API design.

## Notes
The current code is a learning project, so the README focuses on explaining the database behavior rather than hiding it behind abstractions. That makes it easier to understand how PostgreSQL transactions and joins work in a real backend flow.

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
