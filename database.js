const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: "./dealership.db",
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
  }
  return db;
}

module.exports = { getDb };
