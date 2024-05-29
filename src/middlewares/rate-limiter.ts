import { rateLimiterRedis } from '@src/utils/rate-limit';
import type { NextFunction, Request, Response } from 'express';

const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rateLimiterRes = await rateLimiterRedis.consume(req.ip as string);
    const headers = {
      'X-RateLimit-Retry-After': rateLimiterRes.msBeforeNext / 1000,
      'X-RateLimit-Limit': rateLimiterRedis.points,
      'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
      'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext)
    };
    res.set(headers);
    next();
  } catch (err: any) {
    next(err);
  }
};

export default rateLimiterMiddleware;
