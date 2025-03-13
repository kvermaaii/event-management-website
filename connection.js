import sqlite3 from 'sqlite3';

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error connecting to the in-memory database:', err.message);
    } else {
        console.log('Connected to the in-memory SQLite database.');
    }
});

export default db;
