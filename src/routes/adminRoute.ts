import express from 'express';
import {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  loginAdmin,
  getStats
} from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Route publique
router.post('/login', loginAdmin);

// Routes protégées
router.get('/',  getAllAdmins);
router.post('/', createAdmin);
router.delete('/:id', authenticateAdmin, deleteAdmin);
router.get('/stats', authenticateAdmin, getStats)

export default router;
