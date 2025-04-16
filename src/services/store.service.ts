import dataSource from '@src/db/data-source';
import { Store } from '@src/db/entities/store.entity';
import { Workspace } from '@src/db/entities/workspace.entity';
import ResponseError from '@src/error';
import { storeSchema } from '@src/schema/store.schema';
import type { TStore } from '@src/types/store';
import { buildPaginationParams } from '@src/utils/pagination';
import { useValidator } from '@src/utils/validator';
import type { Request, Response } from 'express';

const storeRepository = dataSource.getRepository(Store);
const workspaceRepository = dataSource.getRepository(Workspace);

async function getWorkspace(workspace_id: number, user_id: number) {
  const workspace = await workspaceRepository.findOneBy({
    id: workspace_id,
    user: {
      id: user_id
    }
  });

  if (!workspace) throw new ResponseError(400, 'Workspace is not found');

  return workspace;
}

async function create(req: Request, res: Response) {
  const parsedBody = useValidator<TStore>({
    data: req.body,
    schema: storeSchema
  });

  const workspace = await getWorkspace(parseInt(req.params.workspace_id), res.locals.session.id);

  const store = new Store();
  store.name = String(parsedBody?.name);
  store.workspace = workspace;
  const result = await storeRepository.save(store);

  const data = {
    id: result.id,
    name: result.name,
    created_at: result.created_at,
    updated_at: result.updated_at
  };

  return data;
}

async function getList(req: Request, res: Response) {
  const { page, limit, offset, col, direction, search } = buildPaginationParams(req);
  const workspace = await getWorkspace(parseInt(req.params.workspace_id), res.locals.session.id);

  const [stores, count] = await storeRepository
    .createQueryBuilder('store')
    .where('store.workspace_id = :id AND store.name LIKE :name', { id: workspace.id, name: `%${search}%` })
    .orderBy(col, direction)
    .limit(limit)
    .offset(offset)
    .cache(3000)
    .getManyAndCount();

  const data = {
    page,
    limit,
    total: count,
    rows: stores.map((v) => ({
      id: v.id,
      name: v.name,
      created_at: v.created_at,
      updated_at: v.updated_at
    }))
  };

  return {
    data
  };
}

async function getDetail(req: Request, res: Response) {
  const workspace = await getWorkspace(parseInt(req.params.workspace_id), res.locals.session.id);

  const store = await storeRepository.findOneBy({
    id: parseInt(req.params.store_id, 10),
    workspace: {
      id: workspace.id
    }
  });

  if (!store) throw new ResponseError(404, 'Store is not found');

  return store;
}

async function update(req: Request, res: Response) {
  const parsedBody = useValidator<TStore>({
    data: req.body,
    schema: storeSchema
  });

  const workspace = await getWorkspace(parseInt(req.params.workspace_id), res.locals.session.id);

  const store = await storeRepository.findOneBy({
    id: parseInt(req.params.store_id, 10),
    workspace: {
      id: workspace.id
    }
  });

  if (!store) throw new ResponseError(404, 'Store is not found');

  store.name = String(parsedBody?.name);
  await storeRepository.save(store);

  return true;
}

async function destroy(req: Request, res: Response) {
  const workspace = await getWorkspace(parseInt(req.params.workspace_id), res.locals.session.id);

  const store = await storeRepository.findOneBy({
    id: parseInt(req.params.store_id, 10),
    workspace: {
      id: workspace.id
    }
  });

  if (!store) throw new ResponseError(404, 'Store is not found');

  await storeRepository.remove(store);

  return true;
}

export default {
  create,
  getList,
  update,
  destroy,
  getDetail
};
