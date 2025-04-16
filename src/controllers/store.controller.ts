import storeService from '@src/services/store.service';
import HttpResponse from '@src/utils/response';
import type { NextFunction, Request, Response } from 'express';

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await storeService.create(req, res);
    HttpResponse.success(res, {
      statusCode: 201,
      message: 'Store created successfully',
      result
    });
  } catch (error: any) {
    next(error);
  }
}

async function getStores(req: Request, res: Response, next: NextFunction) {
  try {
    const { data } = await storeService.getList(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      result: data
    });
  } catch (error: any) {
    next(error);
  }
}

async function getDetailStore(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await storeService.getDetail(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      result
    });
  } catch (error: any) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    await storeService.update(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'Store updated successfully'
    });
  } catch (error: any) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await storeService.destroy(req, res);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'Store deleted successfully'
    });
  } catch (error: any) {
    next(error);
  }
}

export default {
  create,
  getStores,
  getDetailStore,
  update,
  remove
};
