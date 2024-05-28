import HttpResponse from '@src/utils/response';
import { NextFunction, Request, Response } from 'express';
import workspaceService from '@src/services/workspace.service';

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await workspaceService.store(req, res);
    HttpResponse.success(res, {
      statusCode: 201,
      message: 'Workspace created successfully',
      result: result
    });
  } catch (error: any) {
    next(error);
  }
}

async function getWorkspace(req: Request, res: Response, next: NextFunction) {
  try {
    const { data } = await workspaceService.getUserWorkspace(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      result: data
    });
  } catch (error: any) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    await workspaceService.update(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'Workspace updated successfully'
    });
  } catch (error: any) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await workspaceService.destroy(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'Workspace deleted successfully'
    });
  } catch (error: any) {
    next(error);
  }
}

export default {
  create,
  getWorkspace,
  update,
  remove
};
