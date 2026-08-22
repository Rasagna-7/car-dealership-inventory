const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function getDb() {
  if (!db) {
    const filename = process.env.NODE_ENV === "test" ? ":memory:" : "./dealership.db";

    db = await open({
      filename,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT "user"
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0
      )
    `);
  }
  return db;
}

module.exports = { getDb };
