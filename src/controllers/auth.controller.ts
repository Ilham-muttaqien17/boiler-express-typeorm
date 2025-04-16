import type { Request, Response } from 'express';
import HttpResponse from '@src/utils/response';
import authService from '@src/services/auth.service';

async function register(req: Request, res: Response) {
  const result = await authService.register(req);
  HttpResponse.success(res, {
    statusCode: 201,
    message: 'User created successfully',
    result: result
  });
}

async function login(req: Request, res: Response) {
  const result = await authService.login(req);
  HttpResponse.success(res, {
    statusCode: 200,
    result
  });
}

async function getCurrentUser(req: Request, res: Response) {
  const result = await authService.getCurrentUser(res);
  HttpResponse.success(res, {
    statusCode: 200,
    result
  });
}

async function logout(req: Request, res: Response) {
  await authService.logout(res);
  HttpResponse.success(res, {
    statusCode: 200,
    message: 'Logout success'
  });
}

export default {
  login,
  register,
  getCurrentUser,
  logout
};
