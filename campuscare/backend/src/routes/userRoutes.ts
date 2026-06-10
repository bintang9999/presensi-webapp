import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
