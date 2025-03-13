import express from 'express';
const app = express();
const port = 3000;
import { v4 as uuidv4 } from 'uuid';
import { setUser } from './services/auth.js';
import cookieParser from 'cookie-parser';
import {isAuth} from './middlewares/auth.js';
import authRouter from './routes/authentication.js';
import paymentRouter from './routes/payment.js'
import eventRouter from './routes/event.js';
import handle404 from './controllers/errorController.js';

app.use(express.json());
app.use(express.urlencoded({extended: true}));;
app.use(cookieParser());

app.set('view engine', 'ejs');  // Set up EJS for templating
app.set('views', './views');
app.use(express.static("Public"));

export const users = [];  // In-memory database for storing users

app.get('/', (req, res) => {
  res.render("home.ejs");
})
app.use('/',authRouter);
app.use('/payments', paymentRouter);
app.use('/events', eventRouter);

app.get('/admin', (req, res) => {
  res.render("admin.ejs");
});

app.get('/event', (req, res) => {
    const { title } = req.query;
    res.render('event_page', { title });
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

// app.get('/:category', isAuth, (req, res) => {
//   const category = req.params.category;
//   const cards = categories[category];
//   if (cards) {
//     res.render('category', { category, cards });
//   } else {
//     res.status(404).render('404');
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

