import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

router.get('/dashboard', userController.loadDashboard);
router.get('/events', userController.getUserEvents);
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

export default router;