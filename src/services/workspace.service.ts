import dataSource from '@src/db/data-source';
import { Workspace } from '@src/db/entities/workspace.entity';
import ResponseError from '@src/error';
import { TWorkspace } from '@src/types/workspace';
import { buildPaginationParams } from '@src/utils/pagination';
import { useValidator } from '@src/utils/validator';
import { Request, Response } from 'express';
import { z } from 'zod';

const workspaceRepository = dataSource.getRepository(Workspace);

const storeValidation = z.object<Record<keyof TWorkspace, any>>({
  name: z.string().trim().min(1, 'Is required')
});

async function store(req: Request, res: Response) {
  const parsedBody = useValidator<TWorkspace>({
    data: req.body,
    schema: storeValidation
  });

  const workspace = new Workspace();
  workspace.name = String(parsedBody?.name);
  workspace.user = res.locals.session;
  const result = await workspaceRepository.save(workspace);

  const data = {
    id: result.id,
    name: result.name,
    created_at: result.created_at,
    updated_at: result.updated_at
  };

  return data;
}

async function getUserWorkspace(req: Request, res: Response) {
  const { page, limit, offset, col, direction } = buildPaginationParams(req);
  const user = res.locals.session;

  const [workspaces, count] = await workspaceRepository
    .createQueryBuilder('workspace')
    .where('workspace.user_id = :id', { id: user.id })
    .orderBy(col, direction)
    .limit(limit)
    .offset(offset)
    .getManyAndCount();

  const data = {
    page,
    limit,
    total: count,
    rows: workspaces.map((v) => ({
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

async function update(req: Request, res: Response) {
  const parsedBody = useValidator<TWorkspace>({
    data: req.body,
    schema: storeValidation
  });
  const user = res.locals.session;

  const workspace = await workspaceRepository.findOneBy({
    id: parseInt(req.params.id, 10),
    user: {
      id: user.id
    }
  });

  if (!workspace) throw new ResponseError(404, 'Workspace is not found');

  workspace.name = parsedBody?.name as string;
  await workspaceRepository.save(workspace);

  return true;
}

async function destroy(req: Request, res: Response) {
  const user = res.locals.session;

  const workspace = await workspaceRepository.findOneBy({
    id: parseInt(req.params.id, 10),
    user: {
      id: user.id
    }
  });

  if (!workspace) throw new ResponseError(404, 'Workspace is not found');

  await workspaceRepository.remove(workspace);

  return true;
}

export default {
  store,
  getUserWorkspace,
  update,
  destroy
};
