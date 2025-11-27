const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://kingshot:123123@localhost:5432/kingshot";

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

async function ensureTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS saves (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      state JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (user_id)
    );
  `);
}

module.exports = {
  query,
  ensureTables
};
