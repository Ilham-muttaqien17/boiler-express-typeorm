import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const customId = (req.headers['X-Request-ID'] as string) || randomUUID();

  req.requestId = customId;

  res.setHeader('X-Request-ID', customId);

  next();
};

export default requestIdMiddleware;
