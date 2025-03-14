import express from 'express';
const router = express.Router();
import authController from "../controllers/authController.js";
router.get('/login', authController.loadLoginPage);
  // app.post('/login', (req, res) => {
  //   console.log(req.body);
  //   res.redirect('/profile');
  // })
router.get('/sign-up', authController.loadSignUpPage);
router.post("/sign-up", authController.userSignUp);
router.post("/login", authController.userLogin);

export default router;