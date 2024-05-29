import express from 'express';
import authMiddleware from '@src/middlewares/auth';
import permission from '@src/middlewares/permission';
import workspaceController from '@src/controllers/workspace.controller';

const router = express.Router();

router.post('/workspaces', authMiddleware, permission(['create-workspace']), workspaceController.create);
router.get('/workspaces', authMiddleware, permission(['read-workspace']), workspaceController.getWorkspace);
router.put('/workspaces/:id', authMiddleware, permission(['update-workspace']), workspaceController.update);
router.delete(
  '/workspaces/:id',
  authMiddleware,
  permission(['delete-workspace']),
  workspaceController.remove
);

export default router;
