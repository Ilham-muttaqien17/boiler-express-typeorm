import HttpResponse from '@src/utils/response';
import type { Request, Response } from 'express';
import workspaceService from '@src/services/workspace.service';

async function create(req: Request, res: Response) {
  const result = await workspaceService.store(req, res);
  HttpResponse.success(res, {
    statusCode: 201,
    message: 'Workspace created successfully',
    result: result
  });
}

async function getWorkspace(req: Request, res: Response) {
  const { data } = await workspaceService.getList(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    result: data
  });
}

async function getDetailWorkspace(req: Request, res: Response) {
  const result = await workspaceService.getDetail(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    result
  });
}

async function update(req: Request, res: Response) {
  await workspaceService.update(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    message: 'Workspace updated successfully'
  });
}

async function remove(req: Request, res: Response) {
  await workspaceService.destroy(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    message: 'Workspace deleted successfully'
  });
}

export default {
  create,
  getWorkspace,
  getDetailWorkspace,
  update,
  remove
};
