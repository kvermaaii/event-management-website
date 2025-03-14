import express from 'express';
const router = express.Router();
import orgController from '../controllers/orgController.js'

router.get('/dashboard', orgController.loadDashboard);
router.get('/events', orgController.getOrgEvents);
router.post('/events', orgController.createEvents);
router.put('/events/:id', orgController.updateEvnet);
router.delete('/events/:id', orgController.delateEvent);

export default router;