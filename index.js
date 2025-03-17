import express from 'express';
const app = express();
const port = 3000;
import { v4 as uuidv4 } from 'uuid';
import { setUser } from './services/auth.js';
import cookieParser from 'cookie-parser';
import {isAuth} from './middlewares/auth.js';
import authRouter from './routes/authentication.js';
import paymentRouter from './routes/payment.js';
import eventRouter from './routes/event.js';
import adminRouter from './routes/admin.js'
import userRouter from './routes/user.js';
import organizerRouter from './routes/organizer.js';
import handle404 from './controllers/errorController.js';
import './connection.js';
import createUserTable from './models/user.js'

app.use(express.json());
app.use(express.urlencoded({extended: true}));;
app.use(cookieParser());

app.set('view engine', 'ejs');  // Set up EJS for templating
app.set('views', './views');
app.use(express.static("Public"));

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

app.get('/', (req, res) => {
  res.render("home.ejs");
})
app.use('/',authRouter);
app.use('/payments', paymentRouter);
app.use('/events', eventRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/organizer', organizerRouter);

app.get('/create-event', (req, res) => {
  res.render('base', { title: 'Create Event', content: 'create_event' });
});


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

app.get('/:category', (req, res) => {
  const category = req.params.category;
  const cards = categories[category];
  if (cards) {
    res.render('category', { category, cards });
  } else {
    res.status(404).render('404');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

