# BookNotesApp
A web app to store your book notes, inspired by Derek Sivers, built with Node.js, Express, PostgreSQL, and EJS.

## Setup Instructions
1. Clone this repo
2. Run `npm install`
3. Configure your PostgreSQL database in `db/index.js`
4. Create the `books` table using the schema below
5. Run `nodemon app.js`
6. Open `http://localhost:3000` in your browser

## PostgreSQL Table Schema
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  rating INT,
  review TEXT,
  date_read DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
