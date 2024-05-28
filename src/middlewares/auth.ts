import { NextFunction, Request, Response } from 'express';
import ResponseError from '@src/error';
import jwt from 'jsonwebtoken';
import env from '@config/index';
import { useRedisClient } from '@src/utils/redis';
import { User } from '@src/db/entities/user.entity';
import dataSource from '@src/db/data-source';

const userRepository = dataSource.getRepository(User);

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

    const user = await userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        users_roles: {
          role: {
            roles_permissions: {
              permission: true
            }
          }
        }
      }
    });

    res.locals.session = user as User;
    next();
  } catch (err: any) {
    next(err);
  }
};

export default authMiddleware;
