import db from '../connection.js';

const createRegistrationTable = async () => {
  await db.exec(`
   CREATE TABLE IF NOT EXISTS Registration (
       registrationId INTEGER PRIMARY KEY AUTOINCREMENT,
       userId INTEGER NOT NULL,
       eventId INTEGER NOT NULL,
       registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
       FOREIGN KEY (eventId) REFERENCES Event(eventId) ON DELETE CASCADE,
       UNIQUE(userId, eventId) -- To prevent duplicate registrations
   );
  `);
};

export default createRegistrationTable;
