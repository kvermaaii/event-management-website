import sqlite3 from 'sqlite3';
// i ma importing all the models to be initiallized in connection.js so that table is created after the db is init
import createUserTable from './models/user.js';
import createOrganizerTable from './models/organizer.js';
import createEventTable from './models/event.js';

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:', async (err) => {
    if (err) {
        console.error('Error connecting to the in-memory database:', err.message);
    } else {
        console.log('Connected to the in-memory SQLite database.');

        try {
            // Initialize User table
            await createUserTable(db);
            console.log("User table initialized successfully.");
            await createOrganizerTable(db);
            console.log("Organizer table initialized successfully.")
            await createEventTable(db);
            console.log("Event table initialized successfully.")
        } catch (error) {
            console.error("Error initializing database tables:", error);
            process.exit(1); // Exit process if initialization fails
        }
    }
});

export default db;
