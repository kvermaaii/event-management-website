import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../services/auth.js';
import { getUser } from '../services/auth.js';
import cookieParser from 'cookie-parser';
import db from '../connection.js';
import bcrypt from 'bcrypt';

class orgController{
    async loadDashboard (req, res){
        res.render('creator_dashboard.ejs')
    }
    async getOrgEvents (req, res){

    }  
    async createEvents (req, res){

        try {
            const sessionId = req.cookies.uid;
            const user = getUser(sessionId);

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

        const organizer = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM Organizer WHERE userId = ?',[user.userId], (err, row) => {
                if(err) return reject(err);
                resolve(row);
            })
        });
        if(!organizer){
            return res.status(403).json({message: 'You are not registered as an organizer'});
        }
        console.log("Body : ",req.body)
        const{category, title, description, startDateTime, endDateTime, venue, capacity, price, status} = req.body;

        if (!category || !title || !description || !startDateTime || !endDateTime || !venue || !capacity || !price) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await new Promise((resolve, reject) => {
            db.run('INSERT INTO Event (category, title, description, startDateTime, endDateTime, venue, capacity, ticketPrice, status, organizerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [category, title, description, startDateTime, endDateTime, venue, capacity, price, status, organizer.organizerId],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });        
        res.status(201).json({ message: 'Event created successfully!' });
        res.redirect('/organizer/dashboard');
        } catch(error){
            console.error('Error creating event:', error);
            res.status(500).json({ message: 'An error occurred while creating the event.' });
        }

    } 
    async updateEvnet (req, res){

    }
    async delateEvent (req, res){

    }
}

export default new orgController();