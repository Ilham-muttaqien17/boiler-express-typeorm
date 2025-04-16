import type { AnyType } from '@src/types';
import type { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import ResponseError from '@src/error';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { RateLimiterRes } from 'rate-limiter-flexible';
import { rateLimiterRedis } from './rate-limit';
import env from '@config/index';

interface SuccessResponse<T extends AnyType = AnyType> {
  statusCode: number;
  result?: T;
  message?: string;
}

const HttpResponse = {
  success: (res: Response, { statusCode, message, result }: SuccessResponse) => {
    return res.status(statusCode).send({
      message,
      result
    });
  },
  error: (res: Response, err: any) => {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      return res.status(401).send({
        message: 'Token is not valid, please sign in again'
      });
    }

    if (err instanceof ResponseError) {
      return res.status(err.statusCode).send({
        message: err.message,
        errors: err.errors
      });
    }

    if (err instanceof QueryFailedError || err instanceof TypeORMError) {
      return res.status(400).send({
        message: err.message
      });
    }

    if (err instanceof RateLimiterRes) {
      const headers = {
        'X-RateLimit-Retry-After': err.msBeforeNext / 1000,
        'X-RateLimit-Limit': rateLimiterRedis.points,
        'X-RateLimit-Remaining': err.remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + err.msBeforeNext)
      };
      res.set(headers);
      return res.status(429).send({
        message: 'Too many request, please try again later.'
      });
    }

    if (
      (err instanceof QueryFailedError || err instanceof TypeORMError || err instanceof TypeError) &&
      env.NODE_ENV === 'development'
    ) {
      return res.status(500).send({
        message: err.message
      });
    }

    return res.status(500).send({
      message: 'Internal server error, please contact developer!'
    });
  }
};

export default HttpResponse;
