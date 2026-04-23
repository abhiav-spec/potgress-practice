# neon-first

A simple Node.js + Express API connected to a Neon PostgreSQL database using `pg`.

## What This Project Does

- Connects to PostgreSQL on startup.
- Reads users from the `users` table and logs them.
- Exposes a `POST /signup` API to insert a new user.

## Tech Stack

- Node.js (ES Modules)
- Express
- pg (PostgreSQL client)
- Nodemon

## Project Structure

- `index.js`: Express server, DB connection, and `/signup` route.
- `package.json`: scripts and dependencies.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Server runs on:

- `http://localhost:3000`

## API

### POST /signup

Creates a new user in the `users` table.

Request body:

```json
{
  "username": "TestUser",
  "email": "test@example.com",
  "password": "Test@123"
}
```

Example with curl:

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"TestUser","email":"test@example.com","password":"Test@123"}'
```

Success response:

```json
{
  "message": "User signed up successfully",
  "user": {
    "id": 11,
    "username": "TestUser",
    "email": "test@example.com",
    "password": "Test@123",
    "created_at": "2026-04-21T13:32:27.868Z"
  }
}
```

## Discussion Summary (What We Fixed)

- Fixed invalid import from `pg`:
  - Incorrect: `import {Client, client} from 'pg'`
  - Correct: `import { Client } from 'pg'`
- Added JSON middleware:
  - `app.use(express.json())`
- Fixed SQL insert query to use parameterized placeholders:
  - `VALUES ($1, $2, $3)`
- Added `RETURNING *` to return inserted user.
- Fixed broken route response/syntax errors and improved error handling.
- Ensured server starts and accepts signup requests.

## Known Improvement

Current DB credentials are hardcoded in `index.js`. Move them to environment variables before sharing or deploying.

Suggested variables:

- `DB_USER`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`

## Useful Commands

Stop processes running on common dev ports:

```bash
p3000=$(lsof -ti tcp:3000 -sTCP:LISTEN)
p5173=$(lsof -ti tcp:5173 -sTCP:LISTEN)
[ -n "$p3000" ] && kill -TERM $p3000
[ -n "$p5173" ] && kill -TERM $p5173
```
