import express from 'express';
import authMiddleware from '@src/middlewares/auth';
import permission from '@src/middlewares/permission';
import workspaceController from '@src/controllers/workspace.controller';

const router = express.Router();

router.use(authMiddleware);

router.post('/workspaces', permission(['create-workspace']), workspaceController.create);
router.get('/workspaces', permission(['read-workspace']), workspaceController.getWorkspace);
router.put('/workspaces/:id', permission(['update-workspace']), workspaceController.update);
router.delete('/workspaces/:id', permission(['delete-workspace']), workspaceController.remove);

export default router;
