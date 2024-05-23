import auth from '@src/controllers/auth.controller';
import authMiddleware from '@src/middlewares/auth';
import express from 'express';

const router = express.Router();

router.post('/login', auth.login);
router.post('/secret-registration', auth.register);

router.get('/current-user', authMiddleware, auth.getCurrentUser);

export default router;
