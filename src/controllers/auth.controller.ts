import type { NextFunction, Request, Response } from 'express';
import HttpResponse from '@src/utils/response';
import authService from '@src/services/auth.service';

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req);
    HttpResponse.success(res, {
      statusCode: 201,
      message: 'User created successfully',
      result: result
    });
  } catch (error: any) {
    next(error);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req);
    HttpResponse.success(res, {
      statusCode: 200,
      result
    });
  } catch (error: any) {
    next(error);
  }
}

async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.getCurrentUser(res);
    HttpResponse.success(res, {
      statusCode: 200,
      result
    });
  } catch (error: any) {
    next(error);
  }
}

export default {
  login,
  register,
  getCurrentUser
};
