import {users} from '../index.js'
import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../services/auth.js';

class authController {
    
    async loadSignUpPage (req, res){
      res.render('base', { title: 'Sign-up', content: 'sign-up', showLogin: true, 
        showSignup: false });
    }

    async loadLoginPage (req, res){
      res.render('base', { title: 'Login', content: 'login', showLogin: false, 
        showSignup: true  });
    }
    async userSignUp  (req, res) {
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
    }

    async userLogin  (req, res) {
        const {email, password} = req.body;
      
        if(!users.find((user) => user.email == email && user.password == password)){
          return res.status(401).send("Invalid email or password");
        }
        const user = users.find((user) => user.email === email);
      
        const sesionId = uuidv4();
        setUser(sesionId, user);
        res.cookie("uid",sesionId);
        res.redirect('/');
    }
}

export default new authController();
