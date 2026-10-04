import { Router } from 'express';
import { auth } from '../middleware/authMiddleware.js';
import {
  createTicket,
  listTickets,
} from '../controllers/supportController.js';

const r = Router();

r.post('/', auth, createTicket);
r.get('/', auth, listTickets);

export default r;