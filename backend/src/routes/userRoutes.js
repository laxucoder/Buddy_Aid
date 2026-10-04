import { Router } from 'express';

import { auth } from '../middleware/authMiddleware.js';

import {
  me,
  adminStats,
  adminUsers,
} from '../controllers/userController.js';

const r = Router();

r.get('/me', auth, me);

r.get('/admin-stats', auth, adminStats);

r.get('/admin-users', auth, adminUsers);

export default r;