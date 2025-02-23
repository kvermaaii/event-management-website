import express from 'express';
import ejsLint from 'ejs-lint';
const app = express();
const port = 3000;

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

app.get('/concert', (req, res) => {
  res.render('concert.ejs');
});

app.get('/exhibition', (req, res) => {
  res.render('exhibition.ejs');
});

app.get('/tedx', (req, res) => {
  res.render('tedx.ejs');
});

app.get('/health-camp', (req, res) => {
  res.render('health-camp.ejs');
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
