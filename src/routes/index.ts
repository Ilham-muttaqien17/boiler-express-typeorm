import express from 'express';
import authRoutes from '@src/routes/auth';
import workspaceRoutes from '@src/routes/workspace';

const router = express.Router();

router.use(authRoutes);
router.use(workspaceRoutes);

export default router;
