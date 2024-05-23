import { NextFunction, Request, Response } from 'express';
import HttpResponse from '@src/utils/response';
import logger from '@src/utils/logger';
import ResponseError from '@src/error';
import jwt from 'jsonwebtoken';
import env from '@config/index';
import { useRedisClient } from '@src/utils/redis';
import { User } from '@src/db/entities/user.entity';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new ResponseError(401, 'Unauthorized');
    }

    const [tokenType, tokenValue] = req.headers.authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new ResponseError(401, 'Unauthorized');
    }

    const decoded = jwt.verify(tokenValue, env.JWT_SECRET);
    const userId = (decoded as any).user_id;
    const loggedInTime = (decoded as any).logged_in_time;

    const session = await useRedisClient.getData(`user-session:${userId}:${loggedInTime}`);

    if (!session) {
      throw new ResponseError(401, 'Unauthorized');
    }

    res.locals.session = JSON.parse(session) as User;
    next();
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

export default authMiddleware;
