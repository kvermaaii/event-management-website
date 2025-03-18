import db from '../connection.js';

const createEventTable = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Event (
      eventId INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      startDateTime DATETIME NOT NULL,
      endDateTime DATETIME NOT NULL,
      venue TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      ticketPrice REAL NOT NULL,
      status TEXT DEFAULT 'Upcoming',
      organizerId INTEGER NOT NULL,
      FOREIGN KEY (organizerId) REFERENCES Organizer(organizerId) ON DELETE CASCADE
    );
  `);
};

export default createEventTable;
