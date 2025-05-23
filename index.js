import express from 'express';
const app = express();
const port = 3000;
import { v4 as uuidv4 } from 'uuid';
import { setUser, getUser } from './services/auth.js';
import cookieParser from 'cookie-parser';
import {isAuth, optionalAuth} from './middlewares/auth.js';
import authRouter from './routes/authentication.js';
import paymentRouter from './routes/payment.js';
import eventRouter from './routes/event.js';
import adminRouter from './routes/admin.js'
import userRouter from './routes/user.js';
import organizerRouter from './routes/organizer.js';
import handle404 from './controllers/errorController.js';
import connectDB from './connection.js';

import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';

// for getting the events on home page
import Event from './models/event.js';


dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method')); // Enable method override using _method query param



app.set('view engine', 'ejs');  // Set up EJS for templating
app.set('views', './views');
app.use(express.static("Public"));
//for multer
app.use(express.static('uploads'));


// Connect to MongoDB
connectDB();

app.use(
  session({
    secret: "your_secret_key", // Simple hardcoded secret
    resave: false, // Prevents session being saved repeatedly if not modified
    saveUninitialized: false, // Don't save uninitialized sessions
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@nightlifeapp.k11i9sx.mongodb.net/EventManagement?retryWrites=true&w=majority`,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // Prevents client-side JS access
      secure: false, // Set true in production with HTTPS
    },
  })
);

// Ensure tables are created before starting the server
// (async () => {
//   try {
//     await createUserTable();
//     console.log("User table initialized successfully.");
//   } catch (error) {
//     console.error("Error initializing database tables:", error);
//     process.exit(1); // Exit process if initialization fails
//   }
// })();

// Global middleware ensures isAuth is always available
app.use((req, res, next) => {
  res.locals.isAuth = false; // Default value
  res.locals.user = null;   // Default value
  next();
});
// app.get('/', optionalAuth, (req, res) => {
//   res.render("home.ejs");
// })

// Route to render home page with events - Using eventController
import eventController from './controllers/eventController.js';
app.get('/',optionalAuth, eventController.getAllEvents);

// Single event page route
app.get('/event/:id', optionalAuth, eventController.getEventById);

// app.get('/', (req, res) => {
//   res.render("home.ejs");
// })

// Route for Contact Us page
app.get('/contact', optionalAuth, (req, res) => {
  res.render("contact.ejs");
})

app.use('/',authRouter);
app.use('/payments', paymentRouter);
app.use('/events', eventRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/organizer', organizerRouter);

const categories = {
  concert: [
    { title: 'Concert 1', image: '/images/blank.png' },
    { title: 'Concert 2', image: '/images/blank.png' },
    { title: 'Concert 3', image: '/images/blank.png' },
    { title: 'Concert 4', image: '/images/blank.png' }
  ],
  exhibition: [
    { title: 'Exhibition 1', image: '/images/blank.png' },
    { title: 'Exhibition 2', image: '/images/blank.png' },
    { title: 'Exhibition 3', image: '/images/blank.png' },
    { title: 'Exhibition 4', image: '/images/blank.png' }
  ],
  tedx: [
    { title: 'TEDx 1', image: '/images/blank.png' },
    { title: 'TEDx 2', image: '/images/blank.png' },
    { title: 'TEDx 3', image: '/images/blank.png' },
    { title: 'TEDx 4', image: '/images/blank.png' },
    { title: 'TEDx 1', image: '/images/blank.png' },
    { title: 'TEDx 2', image: '/images/blank.png' },
    { title: 'TEDx 3', image: '/images/blank.png' },
    { title: 'TEDx 4', image: '/images/blank.png' },
    { title: 'TEDx 1', image: '/images/blank.png' },
    { title: 'TEDx 2', image: '/images/blank.png' },
    { title: 'TEDx 3', image: '/images/blank.png' },
    { title: 'TEDx 4', image: '/images/blank.png' }
  ],
  'health-camp': [
    { title: 'Health Camp 1', image: '/images/blank.png' },
    { title: 'Health Camp 2', image: '/images/blank.png' },
    { title: 'Health Camp 3', image: '/images/blank.png' },
  ]
};

// app.get('/:category', (req, res) => {
//   const category = req.params.category;
//   const cards = categories[category];
//   if (cards) {
//     res.render('category', { category, cards });
//   } else {
//     res.status(404).render('404');
//   }
// });

app.get('/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const events = await Event.find({ category: new RegExp(category, 'i') }).lean();
    console.log('Events fetched:', events);

    if (!events || events.length === 0) {
      return res.render('category', { category, cards: [] });
    }

    res.render('category', { category, cards: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).render('500', { message: 'An error occurred while fetching events.' });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
