import { Router } from 'express';

import { auth } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

import {
  listReports,
  getReport,
  createReport,
  deleteReport,
  moderateReport
} from '../controllers/reportController.js';

const r = Router();

r.get('/', listReports);

r.get('/:id', getReport);

r.post('/', auth, createReport);

// Admin only
r.patch('/:id/moderate', auth, adminOnly, moderateReport);

r.delete('/:id', auth, adminOnly, deleteReport);

export default r;