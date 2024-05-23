import logger from '@src/utils/logger';
import { redisClient } from '@src/utils/redis';
import HttpResponse from '@src/utils/response';
import type { NextFunction, Request, Response } from 'express';
import { RateLimiterRes, RateLimiterRedis, IRateLimiterRedisOptions } from 'rate-limiter-flexible';

const options: IRateLimiterRedisOptions = {
  storeClient: redisClient,
  useRedisPackage: true,
  points: 15, // limit each ip for 15 request per 1 minute
  duration: 60
};

const rateLimiterRedis = new RateLimiterRedis(options);

const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rateLimiterRes = await rateLimiterRedis.consume(req.ip as string);
    const headers = {
      'Retry-After': rateLimiterRes.msBeforeNext / 1000,
      'X-RateLimit-Limit': rateLimiterRedis.points,
      'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext)
    };
    res.set(headers);
    next();
  } catch (err: any) {
    logger.error(err);
    if (err instanceof RateLimiterRes) {
      const headers = {
        'Retry-After': err.msBeforeNext / 1000,
        'X-RateLimit-Limit': rateLimiterRedis.points,
        'X-RateLimit-Remaining': err.remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + err.msBeforeNext)
      };
      res.set(headers);
      HttpResponse.error(res, {
        statusCode: 429,
        message: 'Too many request, please try again later.'
      });
    }
  } finally {
  }
};

export default rateLimiterMiddleware;
