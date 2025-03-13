import express from 'express';
const router = express.Router();
import eventController from '../controllers/eventController.js';

router.get('/', eventController.getAllEvnets);
router.get('/:id', eventController.getEventById);

export default router;