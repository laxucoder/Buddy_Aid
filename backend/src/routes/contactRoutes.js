import { Router } from 'express';
import { auth } from '../middleware/authMiddleware.js';

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';

const router = Router();

router.get('/', auth, getContacts);
router.post('/', auth, createContact);
router.patch('/:id', auth, updateContact);
router.delete('/:id', auth, deleteContact);

export default router;