import express from 'express';
import authMiddleware from '@src/middlewares/auth';
import permission from '@src/middlewares/permission';
import workspaceController from '@src/controllers/workspace.controller';
import storeController from '@src/controllers/store.controller';

const router = express.Router();

/* Workspace Routes */
router.post('/workspaces', authMiddleware, permission(['create-workspace']), workspaceController.create);
router.get('/workspaces', authMiddleware, permission(['read-workspace']), workspaceController.getWorkspace);
router.put('/workspaces/:id', authMiddleware, permission(['update-workspace']), workspaceController.update);
router.delete(
  '/workspaces/:id',
  authMiddleware,
  permission(['delete-workspace']),
  workspaceController.remove
);

/* Store Routes */
router.post(
  '/workspaces/:workspace_id/stores',
  authMiddleware,
  permission(['create-store']),
  storeController.create
);
router.get(
  '/workspaces/:workspace_id/stores',
  authMiddleware,
  permission(['read-store']),
  storeController.getStores
);
router.get(
  '/workspaces/:workspace_id/stores/:store_id',
  authMiddleware,
  permission(['read-store']),
  storeController.getDetailStore
);
router.put(
  '/workspaces/:workspace_id/stores/:store_id',
  authMiddleware,
  permission(['update-store']),
  storeController.update
);
router.delete(
  '/workspaces/:workspace_id/stores/:store_id',
  authMiddleware,
  permission(['delete-store']),
  storeController.remove
);

export default router;
