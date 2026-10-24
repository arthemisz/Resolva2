import express from 'express';
import { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    changePassword 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;
