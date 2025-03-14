import express from 'express';
const router = express.Router();
import adminController from '../controllers/adminController.js'

router.get('/dashboard', adminController.loadDashboard);
router.get('/users',adminController.getAllUsers);
router.get('/events',adminController.getAllEvents);
router.post('/users',adminController.createUser);
router.put('/users/:id',adminController.updateUser);
router.delete('/users/:id',adminController.deleteUser);

export default router;