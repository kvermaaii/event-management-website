// import { v4 as uuidv4 } from 'uuid';
// import { setUser } from '../services/auth.js';
// import { getUser } from '../services/auth.js';
// import cookieParser from 'cookie-parser';
// import db from '../connection.js';
// import bcrypt from 'bcrypt';

// class orgController{
//     async loadDashboard (req, res){
//         try {
//             // Retrieve session information
//             const sessionId = req.cookies.uid;
//             const user = getUser(sessionId);
    
//             if (!user) {
//                 return res.status(401).json({ message: 'Unauthorized' });
//             }
    
//             // Fetch the organizer details
//             const organizer = await new Promise((resolve, reject) => {
//                 db.get(
//                     'SELECT * FROM Organizer WHERE userId = ?',
//                     [user.userId],
//                     (err, row) => {
//                         if (err) return reject(err);
//                         resolve(row);
//                     }
//                 );
//             });
    
//             if (!organizer) {
//                 return res.status(403).json({ message: 'You are not registered as an organizer.' });
//             }
    
//             // Fetch all events created by this organizer
//             const events = await new Promise((resolve, reject) => {
//                 db.all(
//                     'SELECT * FROM Event WHERE organizerId = ?',
//                     [organizer.organizerId],
//                     (err, rows) => {
//                         if (err) return reject(err);
//                         resolve(rows);
//                     }
//                 );
//             });
    
//             // Return the events as a JSON response or render a view
//             // res.status(200).json({ events });
//             console.log("EVENTS: ", events);
//             // OR render a view
//             res.render('creator_dashboard.ejs', { events });
//         } catch (error) {
//             console.error('Error retrieving organizer events:', error);
//             res.status(500).json({ message: 'An error occurred while retrieving events.' });
//         }
//     }
//     async getOrgEvents (req, res){
//         try {
//             const sessionId = req.cookies.uid;
//             const user = getUser(sessionId);
        
//             if (!user) {
//               return res.redirect('/login');
//             }
        
//             // Get the organizer's details
//             const organizer = await new Promise((resolve, reject) => {
//               db.get(
//                 'SELECT * FROM Organizer WHERE userId = ?',
//                 [user.userId],
//                 (err, row) => {
//                   if (err) return reject(err);
//                   resolve(row);
//                 }
//               );
//             });
//             console.log("Organizer ID:", organizer.organizerId);

//             const events = await new Promise((resolve, reject) => {
//                 db.all(
//                   'SELECT * FROM Event WHERE organizerId = ?',
//                   [organizer.organizerId],
//                   (err, rows) => {
//                     if (err) return reject(err);
//                     resolve(rows);
//                   }
//                 );
//               });
//               console.log("Events: ", events)
//               res.render("creator_dashboard.ejs",{events});

//         } catch (error) {
//             console.error('Error loading organizer dashboard:', error);
//             res.status(500).send('An error occurred while loading the dashboard.');
//         }
//     }  
//     async createEvents (req, res){

//         try {
//             const sessionId = req.cookies.uid;
//             const user = getUser(sessionId);

//             if (!user) {
//                 return res.status(401).json({ message: 'Unauthorized' });
//             }

//         const organizer = await new Promise((resolve, reject) => {
//             db.get('SELECT * FROM Organizer WHERE userId = ?',[user.userId], (err, row) => {
//                 if(err) return reject(err);
//                 resolve(row);
//             })
//         });
//         if(!organizer){
//             return res.status(403).json({message: 'You are not registered as an organizer'});
//         }
//         console.log("Body : ",req.body)
//         const{category, title, description, startDateTime, endDateTime, venue, capacity, price, status} = req.body;

//         if (!category || !title || !description || !startDateTime || !endDateTime || !venue || !capacity || !price) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         await new Promise((resolve, reject) => {
//             db.run('INSERT INTO Event (category, title, description, startDateTime, endDateTime, venue, capacity, ticketPrice, status, organizerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//                 [category, title, description, startDateTime, endDateTime, venue, capacity, price, status, organizer.organizerId],
//                 (err) => {
//                     if (err) return reject(err);
//                     resolve();
//                 }
//             );
//         });        
//         // res.status(201).json({ message: 'Event created successfully!' });
//         res.redirect('/organizer/dashboard');
//         } catch(error){
//             console.error('Error creating event:', error);
//             res.status(500).json({ message: 'An error occurred while creating the event.' });
//         }

//     } 
//     async updateEvnet (req, res){

//     }
//     async delateEvent (req, res){

//     }
// }

// export default new orgController();

import { getUser } from '../services/auth.js';
import Organizer from '../models/organizer.js';
import Event from '../models/event.js';

class orgController {
  async loadDashboard(req, res) {
    try {
      // Retrieve session information
    //   const sessionId = req.cookies.uid;
    //   const user = getUser(sessionId);
      const user = req.session.userId;

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Fetch the organizer details
      const organizer = await Organizer.findOne({ userId: req.session.userId });
      console.log("User ID:", req.session.userId);
      console.log("Organizer fetched:", organizer);

      if (!organizer) {
        return res.status(403).json({ message: 'You are not registered as an organizer.' });
      }

      // Fetch all events created by this organizer
      const events = await Event.find({ organizerId: organizer._id });
      const totalEvents = events.length;
      const totalactiveEvents = events.filter(event => event.status === 'start_selling').length;
      const upcomingEvents = events.filter(event => event.status === 'start_selling'); 

      // Render the dashboard view with events
      res.render('creator_dashboard.ejs', { events, totalEvents, totalactiveEvents, upcomingEvents, user });
    } catch (error) {
      console.error('Error retrieving organizer events:', error);
      res.status(500).json({ message: 'An error occurred while retrieving events.' });
    }
  }

  async getOrgEvents(req, res) {
    try {
      const sessionId = req.cookies.uid;
      const user = getUser(sessionId);

      if (!user) {
        return res.redirect('/login');
      }

      // Get the organizer's details
      const organizer = await Organizer.findOne({ userId: req.session.userId });

      if (!organizer) {
        return res.status(403).json({ message: 'You are not registered as an organizer.' });
      }

      // Fetch events associated with the organizer
      const events = await Event.find({ organizerId: organizer._id });
      const totalEvents = events.length;
      const totalactiveEvents = events.filter(event => event.status === 'start_selling').length;

      res.render('creator_dashboard.ejs', { events,  totalEvents, totalactiveEvents});
    } catch (error) {
      console.error('Error loading organizer dashboard:', error);
      res.status(500).send('An error occurred while loading the dashboard.');
    }
  }

  // async createEvents(req, res) {
  //   try {
  //     const sessionId = req.cookies.uid;
  //     const user = getUser(sessionId);

  //     if (!user) {
  //       return res.status(401).json({ message: 'Unauthorized' });
  //     }

  //     const organizer = await Organizer.findOne({ userId: req.session.userId });

  //     if (!organizer) {
  //       return res.status(403).json({ message: 'You are not registered as an organizer.' });
  //     }

  //     const { category, title, description, startDateTime, endDateTime, venue, capacity, price, status } = req.body;

  //     if (!category || !title || !description || !startDateTime || !endDateTime || !venue || !capacity || !price) {
  //       return res.status(400).json({ message: 'All fields are required.' });
  //     }

  //     // Create a new event in the database
  //     const newEvent = new Event({
  //       category,
  //       title,
  //       description,
  //       startDateTime,
  //       endDateTime,
  //       venue,
  //       capacity,
  //       ticketPrice: price,
  //       status: status || 'Upcoming',
  //       organizerId: organizer._id,
  //     });

  //     await newEvent.save();

  //     res.redirect('/organizer/dashboard');
  //   } catch (error) {
  //     console.error('Error creating event:', error);
  //     res.status(500).json({ message: 'An error occurred while creating the event.' });
  //   }
  // }

  async createEvents(req, res) {
    try {
      const sessionId = req.cookies.uid;
      const user = getUser(sessionId);
  
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const organizer = await Organizer.findOne({ userId: req.session.userId });
  
      if (!organizer) {
        return res.status(403).json({ message: 'You are not registered as an organizer.' });
      }
  
      const { category, title, description, startDateTime, endDateTime, venue, capacity, price, status } = req.body;
  
      if (!category || !title || !description || !startDateTime || !endDateTime || !venue || !capacity || !price) {
        return res.status(400).json({ message: 'All fields are required.' });
      }      // Check if an image was uploaded
      const imagePath = req.file ? `/events/${req.file.filename}` : null;
  
      // Create a new event in the database
      const newEvent = new Event({
        category,
        title,
        description,
        startDateTime,
        endDateTime,
        venue,
        capacity,
        ticketPrice: price,
        status: status || 'Upcoming',
        organizerId: organizer._id,
        image: imagePath, // Add the image path to the event
      });
  
      await newEvent.save();
  
      res.redirect('/organizer/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'An error occurred while creating the event.' });
    }
  }

  async updateEvnet (req, res){

  }

  async delateEvent (req, res){

  }
}

export default new orgController();
