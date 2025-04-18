import dataSource from '@src/db/data-source';
import { Workspace } from '@src/db/entities/workspace.entity';
import ResponseError from '@src/error';
import { workspaceSchema } from '@src/schema/workspace.schema';
import type { TWorkspace } from '@src/types/workspace';
import { buildPaginationParams } from '@src/utils/pagination';
import { useValidator } from '@src/utils/validator';
import type { Request, Response } from 'express';

const workspaceRepository = dataSource.getRepository(Workspace);

async function store(req: Request, res: Response) {
  const parsedBody = useValidator<TWorkspace>({
    data: req.body,
    schema: workspaceSchema
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

async function getList(req: Request, res: Response) {
  const { page, limit, offset, col, direction, search } = buildPaginationParams(req);
  const user = res.locals.session;

  const [workspaces, count] = await workspaceRepository
    .createQueryBuilder('workspace')
    .where('workspace.user_id = :id AND workspace.name LIKE :name', { id: user.id, name: `%${search}%` })
    .orderBy(col, direction)
    .limit(limit)
    .offset(offset)
    .cache(3000)
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

async function getDetail(req: Request, res: Response) {
  const workspace = await workspaceRepository.findOne({
    relations: {
      stores: true
    },
    where: {
      id: parseInt(req.params.id, 10),
      user: {
        id: res.locals.session.id
      }
    }
  });

  if (!workspace) throw new ResponseError(404, 'Workspace is not found');

  return workspace;
}

async function update(req: Request, res: Response) {
  const parsedBody = useValidator<TWorkspace>({
    data: req.body,
    schema: workspaceSchema
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
  getList,
  getDetail,
  update,
  destroy
};
