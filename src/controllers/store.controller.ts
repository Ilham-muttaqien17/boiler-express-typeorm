import storeService from '@src/services/store.service';
import HttpResponse from '@src/utils/response';
import type { Request, Response } from 'express';

async function create(req: Request, res: Response) {
  const result = await storeService.create(req, res);
  HttpResponse.success(res, {
    statusCode: 201,
    message: 'Store created successfully',
    result
  });
}

async function getStores(req: Request, res: Response) {
  const { data } = await storeService.getList(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    result: data
  });
}

async function getDetailStore(req: Request, res: Response) {
  const result = await storeService.getDetail(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    result
  });
}

async function update(req: Request, res: Response) {
  await storeService.update(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    message: 'Store updated successfully'
  });
}

async function remove(req: Request, res: Response) {
  await storeService.destroy(req, res);
  HttpResponse.success(res, {
    statusCode: 200,
    message: 'Store deleted successfully'
  });
}

export default {
  create,
  getStores,
  getDetailStore,
  update,
  remove
};
