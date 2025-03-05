import express from 'express';
const app = express();
const port = 3000;
import { v4 as uuidv4 } from 'uuid';
import { setUser } from './services/auth.js';
import cookieParser from 'cookie-parser';
import {isAuth} from './middlewares/auth.js';

app.use(express.json());
app.use(express.urlencoded({extended: true}));;
app.use(cookieParser());

app.set('view engine', 'ejs');  // Set up EJS for templating
app.set('views', './views');

let users = [];  // In-memory database for storing users

app.use(express.static("Public"))

app.get('/', (req, res) => {
  res.render("home.ejs");
})

app.get('/login', (req, res) => {
  res.render('base', { title: 'Login', content: 'login', showLogin: false, 
    showSignup: true  });
})

// app.post('/login', (req, res) => {
//   console.log(req.body);
//   res.redirect('/profile');
// })

app.get('/sign-up', (req, res) => {
  res.render('base', { title: 'Sign-up', content: 'sign-up', showLogin: true, 
    showSignup: false });
})

app.post("/sign-up", async (req, res) => {
  const { email, firstName, password1, password2 } = req.body;

  // Validate input
  if (users.find((user) => user.email === email)) {
    return res.status(400).send("Email already registered.");
  }

  if (!email || !firstName || !password1 || !password2) {
    return res.status(400).send("All fields are required.");
  }
  if (password1 !== password2) {
    return res.status(400).send("Passwords do not match.");
  }

  // Hash the password


  // Add user to the in-memory database
  users.push({ email, firstName, password: password1 });

  //redirect user to home page
  res.redirect('/');
})

app.post("/login", async (req, res) => {
  const {email, password} = req.body;

  if(!users.find((user) => user.email == email && user.password == password)){
    return res.status(401).send("Invalid email or password");
  }
  const user = users.find((user) => user.email === email);

  const sesionId = uuidv4();
  setUser(sesionId, user);
  res.cookie("uid",sesionId);
  res.redirect('/');
})

app.get('/payments', (req, res) => {
  res.render('payments.ejs');
})

app.get('/admin', (req, res) => {
  res.render("admin.ejs");
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

app.get('/:category', isAuth, (req, res) => {
  const category = req.params.category;
  const cards = categories[category];
  if (cards) {
    res.render('category', { category, cards });
  } else {
    res.status(404).render('404');
  }
});


// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

