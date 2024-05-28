import { AnyType } from '@src/types';
import { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import ResponseError from '@src/error';
import { QueryFailedError, TypeORMError } from 'typeorm';

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

    return res.status(err.statusCode).send({
      message: err.message
    });
  }
};

export default HttpResponse;
