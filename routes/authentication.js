import express from 'express';
const router = express.Router();
import authController from "../controllers/authController.js";
router.get('/login', (req, res) => {
    res.render('base', { title: 'Login', content: 'login'});
});
  
  // app.post('/login', (req, res) => {
  //   console.log(req.body);
  //   res.redirect('/profile');
  // })
  
router.get('/sign-up', (req, res) => {
    res.render('base', { title: 'Sign-up', content: 'sign-up'});
});

router.get('/host', (req, res) => {
  res.render('base', { title: 'Host', content: 'host_with_us'});
});
  
router.post("/sign-up", authController.userSignUp);
  
router.post("/login", authController.userLogin);

export default router;