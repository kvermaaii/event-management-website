import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../services/auth.js';
import cookieParser from 'cookie-parser';
import db from '../connection.js';
import bcrypt from 'bcrypt';

class authController {
    
    async loadSignUpPage (req, res){
      res.render('base', { title: 'Sign-up', content: 'sign-up', showLogin: true, 
        showSignup: false });
    }

    async loadLoginPage (req, res){
      res.render('base', { title: 'Login', content: 'login', showLogin: false, 
        showSignup: true  });
    }
    // async userSignUp  (req, res) {
    //     const { email, name, password1, password2 } = req.body;
      
    //     // Validate input
    //     // if (users.find((user) => user.email === email)) {
    //     //   return res.status(400).send("Email already registered.");
    //     // }
      
    //     if (!email || !name || !password1 || !password2) {
    //       return res.status(400).send("All fields are required.");
    //     }
    //     if (password1 !== password2) {
    //       return res.status(400).send("Passwords do not match.");
    //     }
      
    //     try {
    //       // Check if user already exists
    //       const existingUser = await db.get(`SELECT * FROM User WHERE email = ?`, [email]);
    //       if (existingUser) {
    //         return res.status(400).send("Email already registered.");
    //       }
    //       console.log("existinguser: ", existingUser);
    
    //       // Hash the password
    //       const hashedPassword = await bcrypt.hash(password1, 10);
    //       console.log("password is hashed");
    
    //       // Insert the user into the database
    //       await db.run(
    //         `INSERT INTO User (name, email, passwordHash) VALUES (?, ?, ?)`,
    //         [name, email, hashedPassword]
    //       );

    //       console.log("user inserted");
    
    //       res.status(201).send("User registered successfully.");
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).send("An error occurred during sign-up.");
    //     }
            
    //     // // Add user to the in-memory database
    //     // users.push({ email, firstName, password: password1 });
      
    //     //redirect user to home page
    //     res.redirect('/');
    // }

    async userSignUp(req, res) {
      const { email, name, password1, password2 } = req.body;
    
      // Validate input
      if (!email || !name || !password1 || !password2) {
        return res.status(400).send("All fields are required.");
      }
      if (password1 !== password2) {
        return res.status(400).send("Passwords do not match.");
      }
    
      try {
        // Check if user already exists
        const existingUser = await new Promise((resolve, reject) => {
          db.get(`SELECT * FROM User WHERE email = ?`, [email], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
    
        if (existingUser) {
          console.log("existinguser: ", existingUser);
          return res.status(400).send("Email already registered.");
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password1, 10);
        console.log("password is hashed");
    
        // Insert the user into the database
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO User (name, email, passwordHash) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
    
        console.log("user inserted");
        // Only send one response - using redirect
        return res.redirect('/');
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during sign-up.");
      }
    }
    

    // async userLogin  (req, res) {
    //     const {email, password} = req.body;
      
    //     // if(!users.find((user) => user.email == email && user.password == password)){
    //     //   return res.status(401).send("Invalid email or password");
    //     // }
    //     // const user = users.find((user) => user.email === email);

    //     try {
    //       // Find the user in the database
    //       const user = await db.get(`SELECT * FROM User WHERE email = ?`, [email]);
    
    //       if (!user) {
    //         return res.status(401).send("Invalid email or password.");
    //       }
    
    //       // Compare the provided password with the hashed password
    //       const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    //       if (!passwordMatch) {
    //         return res.status(401).send("Invalid email or password.");
    //       }
      
    //     const sesionId = uuidv4();
    //     setUser(sesionId, user);
    //     res.cookie("uid",sesionId);
    //     res.redirect('/');

    //     }catch (error) {
    //       console.error(error);
    //       res.status(500).send("An error occurred during login.");
    //     }
    // }
    async userLogin(req, res) {
      const { email, password } = req.body;
    
      try {
        console.log("Login request received:", { email, password });
    
        // Find the user in the database
        const user = await new Promise((resolve, reject) => {
          db.get(`SELECT * FROM User WHERE email = ?`, [email], (err, row) => {
            if (err) {
              console.error("Database error:", err);
              return reject(err);
            }
            resolve(row);
          });
        });
    
        console.log("User retrieved:", user);
    
        if (!user) {
          console.log("User not found");
          return res.status(401).send("Invalid email or password.");
        }
    
        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        console.log("Password match status:", passwordMatch);
    
        if (!passwordMatch) {
          return res.status(401).send("Invalid email or password.");
        }
    
        const sessionId = uuidv4();
        console.log("Generated session ID:", sessionId);
    
        setUser(sessionId, user);
        res.cookie("uid", sessionId);
        res.redirect('/');
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
      }
    }
    

    
};

export default new authController();
