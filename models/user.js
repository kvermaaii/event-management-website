import db from '../connection.js'

const createUserTable = async () => {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS User (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
};

export default createUserTable;

  