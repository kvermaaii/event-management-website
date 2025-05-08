import express from 'express';
const router = express.Router();
import {isAuth, optionalAuth} from '../middlewares/auth.js';
import orgController from '../controllers/orgController.js'
import upload from '../multerConfig.js';

router.get('/dashboard',optionalAuth ,orgController.loadDashboard);
router.get('/events', orgController.getOrgEvents);
router.post('/events',upload.single('image'), orgController.createEvents);
router.put('/events/:id', orgController.updateEvnet);
router.delete('/events/:id', orgController.delateEvent);

export default router;