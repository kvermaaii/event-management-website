import express from 'express';
import ejsLint from 'ejs-lint';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));;

app.set('view engine', 'ejs');  // Set up EJS for templating
app.set('views', './views');

app.use(express.static("Public"))

app.get('/', (req, res) => {
  res.render("home.ejs");
})

app.get('/login', (req, res) => {
  res.render('base', { title: 'Login', content: 'login', showLogin: false, 
    showSignup: true  });
})

app.get('/sign-up', (req, res) => {
  res.render('base', { title: 'Sign-up', content: 'sign-up', showLogin: true, 
    showSignup: false });
})

app.get('/payments', (req, res) => {
  res.render('payments.ejs');
})

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

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
