// import sqlite3 from 'sqlite3';
// // i am importing all the models to be initiallized in connection.js so that table is created after the db is init
// import createUserTable from './models/user.js';
// import createOrganizerTable from './models/organizer.js';
// import createEventTable from './models/event.js';

// // Initialize SQLite in-memory database
// const db = new sqlite3.Database(':memory:', async (err) => {
//     if (err) {
//         console.error('Error connecting to the in-memory database:', err.message);
//     } else {
//         console.log('Connected to the in-memory SQLite database.');

//         try {
//             // Initialize User table
//             await createUserTable(db);
//             console.log("User table initialized successfully.");
//             await createOrganizerTable(db);
//             console.log("Organizer table initialized successfully.")
//             await createEventTable(db);
//             console.log("Event table initialized successfully.")
//         } catch (error) {
//             console.error("Error initializing database tables:", error);
//             process.exit(1); // Exit process if initialization fails
//         }
//     }
// });

// export default db;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = 'mongodb+srv://kshitijv23:pi5m78dJ7ux7kA3z@cluster0.mongodb.net/EventManagement?retryWrites=true&w=majority';

    // Replace placeholders with your credentials
    // const username = process.env.MONGOUSERNAME;
    // const password = process.env.MONGOPASSWORD;
    // const database = 'EventManagement';
    
    // // Construct the final connection string
    // const cloudDBURI = dbURI
    //     .replace('<username>', username)
    //     .replace('<password>', password)
    //     .replace('<database>', database);

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the app if the database connection fails
  }
};

export default connectDB;
