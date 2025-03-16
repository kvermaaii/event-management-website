import db from '../connection.js';

const createOrganizerTable = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Organizer (
      organizerId INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      organizationName TEXT NOT NULL,
      description TEXT,
      contactNo TEXT NOT NULL,
      verified BOOLEAN DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
    );
  `);
};

export default createOrganizerTable;
