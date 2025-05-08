import express from 'express';
import Event from '../models/event.js';
import { isAuth } from '../middlewares/auth.js';
const router = express.Router();

// Route for payment page with event ID
router.get('/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        
        if (!event) {
            return res.status(404).render('404');
        }
        
        console.log('Path of image', event.image);

        res.render('payments.ejs', {
            event,
            user: req.user,
            title: 'Payment for ' + event.title
        });
    } catch (error) {
        console.error('Error fetching event for payment:', error);
        res.status(500).send('An error occurred while processing your payment request.');
    }
});

// Process payment submission
router.post('/process-payment', isAuth, async (req, res) => {
    try {
        // Payment processing logic will be implemented by the user
        // This is just a placeholder for now
        res.redirect('/user/dashboard'); // Redirect to dashboard after payment
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('An error occurred while processing your payment.');
    }
});

export default router;